
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const InternationalExam = require("./InternationalExam");
const InternationalPurchase = require("./InternationalPurchase");

const {
  getInternationalPricing,
} = require("./exchangeRateService");

const router = express.Router();

/* ==========================================================
   PAYSTACK ENDPOINTS
========================================================== */

const PAYSTACK_INITIALIZE_URL =
  "https://api.paystack.co/transaction/initialize";

const PAYSTACK_VERIFY_URL =
  "https://api.paystack.co/transaction/verify";

/* ==========================================================
   PAYSTACK AUTHENTICATION
========================================================== */

const getPaystackHeaders = () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured."
    );
  }

  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
};

/* ==========================================================
   INTERNATIONAL PAYMENT CALLBACK URL
========================================================== */

const getInternationalCallbackUrl = () => {
  const callbackUrl =
    process.env.INTERNATIONAL_PAYMENT_CALLBACK_URL;

  if (!callbackUrl) {
    throw new Error(
      "INTERNATIONAL_PAYMENT_CALLBACK_URL is not configured."
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(callbackUrl);
  } catch {
    throw new Error(
      "INTERNATIONAL_PAYMENT_CALLBACK_URL is invalid."
    );
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "The payment callback URL must use HTTP or HTTPS."
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "The production payment callback URL must use HTTPS."
    );
  }

  return callbackUrl;
};

/* ==========================================================
   NORMALIZE EXAMINATION CODES
========================================================== */

const normalizeExamCodes = (value) => {
  if (!Array.isArray(value)) {
    throw new Error(
      "Examination codes must be provided as an array."
    );
  }

  const examCodes = value.map((code) =>
    String(code || "").trim().toUpperCase()
  );

  if (examCodes.some((code) => !code)) {
    throw new Error(
      "Examination codes cannot be empty."
    );
  }

  if (new Set(examCodes).size !== examCodes.length) {
    throw new Error(
      "Duplicate examination codes are not allowed."
    );
  }

  return examCodes;
};

/* ==========================================================
   GET INTERNATIONAL PACKAGE PRICES

   GET /api/international/pricing

   Public, read-only endpoint.
   Does not create a purchase or initiate a payment.
========================================================== */

router.get("/pricing", async (req, res) => {
  try {
    const pricing = await getInternationalPricing();

    if (
      !pricing ||
      pricing.success !== true ||
      !pricing.exchangeRate ||
      !Array.isArray(pricing.packages)
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Les tarifs internationaux sont indisponibles.",
      });
    }

    return res.status(200).json(pricing);
  } catch (error) {
    console.error(
      "Erreur de chargement des tarifs internationaux :",
      error.message
    );

    return res.status(503).json({
      success: false,
      message:
        "Impossible de charger les tarifs internationaux.",
    });
  }
});

/* ==========================================================
   INITIALIZE INTERNATIONAL PAYMENT

   POST /api/international/payments/initialize

   Requires authentication.

   SINGLE   = one examination
   BUNDLE_3 = three examinations

   This route does not replace Local CBT payments.
========================================================== */

router.post(
  "/payments/initialize",
  authMiddleware,
  async (req, res) => {
    let purchase = null;
    let paystackInitializationAttempted = false;

    try {
      const examCodes = normalizeExamCodes(
        req.body?.examCodes
      );

      if (![1, 3].includes(examCodes.length)) {
        return res.status(400).json({
          success: false,
          message:
            "Choisissez un examen ou exactement trois examens pour le forfait groupé.",
        });
      }

      const userId =
        req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentification requise pour effectuer cet achat.",
        });
      }

      const user = await User.findById(userId)
        .select("_id email");

      if (!user || !user.email) {
        return res.status(400).json({
          success: false,
          message:
            "Une adresse e-mail valide est nécessaire pour le paiement.",
        });
      }

      const activeExaminations =
        await InternationalExam.find({
          code: { $in: examCodes },
          active: true,
        }).select("code");

      const activeCodes = new Set(
        activeExaminations.map((exam) =>
          String(exam.code).trim().toUpperCase()
        )
      );

      const unavailableCodes = examCodes.filter(
        (code) => !activeCodes.has(code)
      );

      if (unavailableCodes.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Un ou plusieurs examens sélectionnés sont indisponibles.",
          unavailableExamCodes: unavailableCodes,
        });
      }

      const callbackUrl =
        getInternationalCallbackUrl();

      const pricing = await getInternationalPricing();

      if (
        !pricing ||
        pricing.success !== true ||
        !pricing.exchangeRate ||
        !Array.isArray(pricing.packages)
      ) {
        return res.status(503).json({
          success: false,
          message:
            "Les tarifs internationaux sont temporairement indisponibles.",
        });
      }

      const packageCode =
        examCodes.length === 1
          ? "SINGLE"
          : "BUNDLE_3";

      const selectedPrice = pricing.packages.find(
        (item) => item.code === packageCode
      );

      if (
        !selectedPrice ||
        !Number.isFinite(
          Number(selectedPrice.amountNgn)
        ) ||
        Number(selectedPrice.amountNgn) <= 0
      ) {
        return res.status(503).json({
          success: false,
          message:
            "Le prix du forfait sélectionné est indisponible.",
        });
      }

      const reference =
        `INTL-${Date.now()}-${crypto
          .randomBytes(6)
          .toString("hex")
          .toUpperCase()}`;

      /* ----------------------------------------------
         CREATE PENDING PURCHASE
      ---------------------------------------------- */

      purchase = await InternationalPurchase.create({
        userId: user._id,
        email: user.email,
        examCodes,
        amount: Number(selectedPrice.amountNgn),
        currency: "NGN",
        reference,
        packageCode,
        usdReferencePrice: Number(
          selectedPrice.usdReferencePrice
        ),
        exchangeRate: Number(
          pricing.exchangeRate.rate
        ),
        exchangeRateDate:
          pricing.exchangeRate.rateDate,
        exchangeRateProvider:
          pricing.exchangeRate.provider,
        accessDays: Number(
          selectedPrice.accessDays
        ),
        examCount: Number(
          selectedPrice.examCount
        ),
        status: "pending",
      });

      /* ----------------------------------------------
         INITIALIZE PAYSTACK TRANSACTION
      ---------------------------------------------- */

      paystackInitializationAttempted = true;

      const response = await axios.post(
        PAYSTACK_INITIALIZE_URL,
        {
          email: user.email,

          // Paystack requires the amount in kobo.
          amount:
            Number(selectedPrice.amountNgn) * 100,

          currency: "NGN",
          reference,
          callback_url: callbackUrl,

          metadata: {
            purchaseReference: reference,
            userId: String(user._id),
            packageCode,
            examCodes,
            examCount: Number(
              selectedPrice.examCount
            ),
            accessDays: Number(
              selectedPrice.accessDays
            ),
          },
        },
        {
          headers: getPaystackHeaders(),
          timeout: 30000,
        }
      );

      const paystackData = response.data?.data;

      if (
        response.data?.status !== true ||
        !paystackData?.authorization_url ||
        !paystackData?.reference ||
        paystackData.reference !== reference
      ) {
        throw new Error(
          "Paystack did not return a valid payment authorization."
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Initialisation du paiement international réussie.",
        authorizationUrl:
          paystackData.authorization_url,
        reference,
        purchase: {
          reference,
          packageCode,
          examCodes,
          amount: Number(
            selectedPrice.amountNgn
          ),
          currency: "NGN",
          usdReferencePrice: Number(
            selectedPrice.usdReferencePrice
          ),
          exchangeRate: Number(
            pricing.exchangeRate.rate
          ),
          exchangeRateDate:
            pricing.exchangeRate.rateDate,
          exchangeRateProvider:
            pricing.exchangeRate.provider,
          accessDays: Number(
            selectedPrice.accessDays
          ),
          examCount: Number(
            selectedPrice.examCount
          ),
          status: "pending",
        },
      });
    } catch (error) {
      console.error(
        "International payment initialization error:",
        error.response?.data || error.message
      );

      /*
       * Mark the purchase as failed only if Paystack
       * initialization was never attempted.
       *
       * If the request was sent but its response was
       * lost, retain the pending record for verification.
       */

      if (
        purchase &&
        !paystackInitializationAttempted &&
        purchase.status === "pending"
      ) {
        try {
          purchase.status = "failed";
          await purchase.save();
        } catch (saveError) {
          console.error(
            "Unable to update international purchase status:",
            saveError.message
          );
        }
      }

      const clientErrorMessages = [
        "Examination codes must be provided as an array.",
        "Examination codes cannot be empty.",
        "Duplicate examination codes are not allowed.",
      ];

      if (
        clientErrorMessages.includes(error.message)
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(502).json({
        success: false,
        message:
          "Impossible d'initialiser le paiement international. Veuillez réessayer.",
      });
    }
  }
);

/* ==========================================================
   VERIFY INTERNATIONAL PAYMENT

   GET /api/international/payments/verify/:reference

   Requires authentication.

   A successful purchase is not activated again on
   repeated verification, so its access period is not
   extended by refreshing this endpoint.
========================================================== */

router.get(
  "/payments/verify/:reference",
  authMiddleware,
  async (req, res) => {
    try {
      const reference = String(
        req.params.reference || ""
      ).trim();

      if (!reference) {
        return res.status(400).json({
          success: false,
          message:
            "Référence de paiement manquante.",
        });
      }

      const userId =
        req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentification requise.",
        });
      }

      const purchase =
        await InternationalPurchase.findOne({
          reference,
          userId,
        });

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message:
            "Aucun achat international correspondant à cette référence n'a été trouvé.",
        });
      }

      /* ----------------------------------------------
         ALREADY VERIFIED
      ---------------------------------------------- */

      if (purchase.status === "success") {
        return res.status(200).json({
          success: true,
          message:
            "Ce paiement international a déjà été vérifié.",
          purchase: {
            reference: purchase.reference,
            packageCode: purchase.packageCode,
            examCodes: purchase.examCodes,
            amount: purchase.amount,
            currency: purchase.currency,
            accessDays: purchase.accessDays,
            examCount: purchase.examCount,
            purchasedAt: purchase.purchasedAt,
            accessStartsAt:
              purchase.accessStartsAt,
            accessExpiresAt:
              purchase.accessExpiresAt,
            status: purchase.status,
          },
        });
      }

      if (purchase.status !== "pending") {
        return res.status(409).json({
          success: false,
          message:
            "Cet achat n'est plus en attente de vérification.",
          status: purchase.status,
        });
      }

      /* ----------------------------------------------
         VERIFY WITH PAYSTACK
      ---------------------------------------------- */

      const response = await axios.get(
        `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(
          reference
        )}`,
        {
          headers: getPaystackHeaders(),
          timeout: 30000,
        }
      );

      const verification = response.data?.data;

      if (
        response.data?.status !== true ||
        !verification
      ) {
        return res.status(502).json({
          success: false,
          message:
            "Paystack n'a pas retourné de résultat de vérification valide.",
        });
      }

      const returnedReference =
        verification.reference;

      const returnedCurrency =
        String(
          verification.currency || ""
        ).toUpperCase();

      const returnedAmount =
        Number(verification.amount);

      const expectedAmount =
        Number(purchase.amount) * 100;

      /* ----------------------------------------------
         VALIDATE TRANSACTION DETAILS
      ---------------------------------------------- */

      if (
        returnedReference !== purchase.reference ||
        returnedCurrency !== "NGN" ||
        returnedAmount !== expectedAmount
      ) {
        purchase.status = "failed";
        await purchase.save();

        return res.status(400).json({
          success: false,
          message:
            "Les informations du paiement ne correspondent pas à l'achat enregistré.",
        });
      }

      /* ----------------------------------------------
         PAYMENT NOT SUCCESSFUL
      ---------------------------------------------- */

      if (verification.status !== "success") {
        if (
          [
            "failed",
            "abandoned",
            "reversed",
          ].includes(verification.status)
        ) {
          purchase.status = "failed";
          await purchase.save();
        }

        return res.status(402).json({
          success: false,
          message:
            "Le paiement international n'a pas été confirmé comme réussi.",
          paymentStatus: verification.status,
        });
      }

      /* ----------------------------------------------
         ACTIVATE PURCHASE ACCESS PERIOD
      ---------------------------------------------- */

      const purchasedAt = new Date();

      const accessStartsAt =
        purchasedAt;

      const accessExpiresAt =
        new Date(
          purchasedAt.getTime() +
          Number(purchase.accessDays) *
            24 *
            60 *
            60 *
            1000
        );

      purchase.status = "success";
      purchase.purchasedAt = purchasedAt;
      purchase.accessStartsAt =
        accessStartsAt;
      purchase.accessExpiresAt =
        accessExpiresAt;

      await purchase.save();

      return res.status(200).json({
        success: true,
        message:
          "Paiement international vérifié avec succès.",
        purchase: {
          reference: purchase.reference,
          packageCode: purchase.packageCode,
          examCodes: purchase.examCodes,
          amount: purchase.amount,
          currency: purchase.currency,
          accessDays: purchase.accessDays,
          examCount: purchase.examCount,
          purchasedAt: purchase.purchasedAt,
          accessStartsAt:
            purchase.accessStartsAt,
          accessExpiresAt:
            purchase.accessExpiresAt,
          status: purchase.status,
        },
      });
    } catch (error) {
      console.error(
        "International payment verification error:",
        error.response?.data || error.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Impossible de vérifier le paiement international pour le moment. Veuillez réessayer.",
      });
    }
  }
);

/* ==========================================================
   EXPORT ROUTER
========================================================== */

module.exports = router;