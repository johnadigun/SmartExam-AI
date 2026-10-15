
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");
const dns = require("node:dns");

const authMiddleware = require("../middleware/authMiddleware");
const getInternationalCandidateModel = require(
  "../models/internationalCandidate"
);
const InternationalExam = require("./InternationalExam");
const InternationalPurchase = require("./InternationalPurchase");

const {
  getInternationalPricing,
} = require("./exchangeRateService");

const router = express.Router();

/* ==========================================================
   INTERNATIONAL CANDIDATE DATABASE
   Separate from the Local CBT candidate database.
========================================================== */

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.error(
    "International DNS configuration error:",
    error.message
  );
}

let internationalConnection = null;
let internationalConnectionPromise = null;

async function getInternationalCandidateModelInstance() {
  if (internationalConnection?.readyState === 1) {
    return getInternationalCandidateModel(
      internationalConnection
    );
  }

  if (!internationalConnectionPromise) {
    const mongoUri = process.env.INTERNATIONAL_MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "INTERNATIONAL_MONGO_URI is not configured."
      );
    }

    internationalConnection = mongoose.createConnection(
      mongoUri,
      { serverSelectionTimeoutMS: 15000 }
    );

    internationalConnectionPromise =
      internationalConnection.asPromise().catch((error) => {
        internationalConnectionPromise = null;
        internationalConnection = null;
        throw error;
      });
  }

  await internationalConnectionPromise;

  return getInternationalCandidateModel(
    internationalConnection
  );
}

/* ==========================================================
   INTERNATIONAL AUTHENTICATION GUARD
========================================================== */

function requireInternationalCandidate(req, res, next) {
  if (req.user?.platform !== "international") {
    return res.status(403).json({
      success: false,
      message:
        "Please sign in with your International examination account.",
    });
  }

  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message:
        "International candidate authentication is required.",
    });
  }

  return next();
}

/* ==========================================================
   PAYSTACK CONFIGURATION
========================================================== */

const PAYSTACK_INITIALIZE_URL =
  "https://api.paystack.co/transaction/initialize";

const PAYSTACK_VERIFY_URL =
  "https://api.paystack.co/transaction/verify";

const DEFAULT_INTERNATIONAL_CALLBACK_URL =
  "https://smartexam-frontend.onrender.com/international-payment-success";

function getInternationalCallbackUrl() {
  const callbackUrl =
    process.env.INTERNATIONAL_PAYMENT_CALLBACK_URL ||
    DEFAULT_INTERNATIONAL_CALLBACK_URL;

  let parsedUrl;

  try {
    parsedUrl = new URL(callbackUrl);
  } catch {
    throw new Error(
      "INTERNATIONAL_PAYMENT_CALLBACK_URL is invalid."
    );
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(
      "The International payment callback must use HTTP or HTTPS."
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "The production International payment callback must use HTTPS."
    );
  }

  if (
    parsedUrl.pathname.replace(/\/+$/, "") !==
    "/international-payment-success"
  ) {
    throw new Error(
      "The International payment callback must point to /international-payment-success."
    );
  }

  return parsedUrl.toString();
}

function getPaystackHeaders() {
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
}

/* ==========================================================
   NORMALIZE EXAMINATION CODES
========================================================== */

function normalizeExamCodes(value) {
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
}

/* ==========================================================
   PUBLIC PURCHASE RESPONSE
   Return only fields needed by the payment-success page.
========================================================== */

function toPurchaseResponse(purchase) {
  return {
    reference: purchase.reference,
    packageCode: purchase.packageCode,
    examCodes: purchase.examCodes,
    amount: purchase.amount,
    currency: purchase.currency,
    accessDays: purchase.accessDays,
    examCount: purchase.examCount,
    purchasedAt: purchase.purchasedAt,
    accessStartsAt: purchase.accessStartsAt,
    accessExpiresAt: purchase.accessExpiresAt,
    status: purchase.status,
  };
}

/* ==========================================================
   GET INTERNATIONAL PACKAGE PRICES

   GET /api/international/pricing
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
          "International examination prices are unavailable.",
      });
    }

    return res.status(200).json(pricing);
  } catch (error) {
    console.error(
      "International pricing error:",
      error.message
    );

    return res.status(503).json({
      success: false,
      message:
        "Unable to load International examination prices.",
    });
  }
});

/* ==========================================================
   INITIALIZE INTERNATIONAL PAYMENT

   POST /api/international/payments/initialize

   SINGLE   = one examination
   BUNDLE_3 = three examinations

   Authentication remains required here.
========================================================== */

router.post(
  "/payments/initialize",
  authMiddleware,
  requireInternationalCandidate,
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
            "Select one examination or exactly three examinations for the bundle.",
        });
      }

      const userId = req.user?.id || req.user?._id;

      const InternationalCandidate =
        await getInternationalCandidateModelInstance();

      const candidate =
        await InternationalCandidate.findById(userId)
          .select("_id email");

      if (
        !candidate?.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          candidate.email
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A valid email address is required for payment. Please check your International account.",
        });
      }

      const candidateEmail = candidate.email.trim();

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
            "One or more selected examinations are unavailable.",
          unavailableExamCodes: unavailableCodes,
        });
      }

      const callbackUrl = getInternationalCallbackUrl();
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
            "International examination prices are temporarily unavailable.",
        });
      }

      const packageCode =
        examCodes.length === 1 ? "SINGLE" : "BUNDLE_3";

      const selectedPrice = pricing.packages.find(
        (item) => item.code === packageCode
      );

      if (
        !selectedPrice ||
        !Number.isFinite(Number(selectedPrice.amountNgn)) ||
        Number(selectedPrice.amountNgn) <= 0
      ) {
        return res.status(503).json({
          success: false,
          message:
            "The selected examination package price is unavailable.",
        });
      }

      const reference =
        `INTL-${Date.now()}-${crypto
          .randomBytes(16)
          .toString("hex")
          .toUpperCase()}`;

      purchase = await InternationalPurchase.create({
        userId: candidate._id,
        email: candidateEmail,
        examCodes,
        amount: Number(selectedPrice.amountNgn),
        currency: "NGN",
        reference,
        packageCode,
        usdReferencePrice: Number(
          selectedPrice.usdReferencePrice
        ),
        exchangeRate: Number(pricing.exchangeRate.rate),
        exchangeRateDate: pricing.exchangeRate.rateDate,
        exchangeRateProvider: pricing.exchangeRate.provider,
        accessDays: Number(selectedPrice.accessDays),
        examCount: Number(selectedPrice.examCount),
        status: "pending",
      });

      paystackInitializationAttempted = true;

      const response = await axios.post(
        PAYSTACK_INITIALIZE_URL,
        {
          email: candidateEmail,
          amount: Number(selectedPrice.amountNgn) * 100,
          currency: "NGN",
          reference,
          callback_url: callbackUrl,
          metadata: {
            purchaseReference: reference,
            userId: String(candidate._id),
            packageCode,
            examCodes,
            examCount: Number(selectedPrice.examCount),
            accessDays: Number(selectedPrice.accessDays),
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
        paystackData.reference !== reference
      ) {
        throw new Error(
          "Paystack did not return a valid payment authorization."
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "International payment initialization successful.",
        authorizationUrl: paystackData.authorization_url,
        reference,
        purchase: toPurchaseResponse(purchase),
      });
    } catch (error) {
      console.error(
        "International payment initialization error:",
        {
          message: error.message,
          status: error.response?.status,
          paystackResponse: error.response?.data,
        }
      );

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
            "Unable to update International purchase status:",
            saveError.message
          );
        }
      }

      const clientErrorMessages = [
        "Examination codes must be provided as an array.",
        "Examination codes cannot be empty.",
        "Duplicate examination codes are not allowed.",
      ];

      if (clientErrorMessages.includes(error.message)) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(502).json({
        success: false,
        message:
          "Unable to initialize International payment. Please try again.",
      });
    }
  }
);

/* ==========================================================
   VERIFY INTERNATIONAL PAYMENT

   GET /api/international/payments/verify/:reference

   This endpoint intentionally does NOT require a browser
   login token because the payment provider returns the
   candidate to this page after checkout.

   Security requirements:
   - The reference must match an existing purchase.
   - Paystack must independently confirm the transaction.
   - Reference, currency, and exact amount must match.
   - Only the existing purchase is activated.
   - The purchase's original userId is never changed.
========================================================== */

router.get(
  "/payments/verify/:reference",
  async (req, res) => {
    try {
      const reference = String(
        req.params.reference || ""
      ).trim();

      if (
        !reference ||
        reference.length > 200 ||
        !/^INTL-[A-Za-z0-9-]+$/i.test(reference)
      ) {
        return res.status(400).json({
          success: false,
          message: "A valid payment reference is required.",
        });
      }

      // Locate the existing purchase. Do not create a new one.
      const purchase = await InternationalPurchase.findOne({
        reference,
      });

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message:
            "No International purchase was found for this payment reference.",
        });
      }

      // A previously activated purchase remains activated.
      if (
        purchase.status === "success" &&
        purchase.accessStartsAt &&
        purchase.accessExpiresAt
      ) {
        return res.status(200).json({
          success: true,
          message:
            "This International payment has already been verified and access activated.",
          purchase: toPurchaseResponse(purchase),
        });
      }

      if (purchase.status !== "pending") {
        return res.status(409).json({
          success: false,
          message:
            "This purchase is no longer awaiting verification.",
          status: purchase.status,
        });
      }

      // Always verify directly with Paystack.
      const response = await axios.get(
        `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`,
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
            "Paystack did not return a valid verification result.",
        });
      }

      const returnedReference = verification.reference;
      const returnedCurrency = String(
        verification.currency || ""
      ).toUpperCase();
      const returnedAmount = Number(verification.amount);
      const expectedAmount = Number(purchase.amount) * 100;

      if (
        returnedReference !== purchase.reference ||
        returnedCurrency !== "NGN" ||
        returnedAmount !== expectedAmount
      ) {
        console.error(
          "International payment validation mismatch:",
          {
            purchaseReference: purchase.reference,
            returnedReference,
            expectedCurrency: "NGN",
            returnedCurrency,
            expectedAmount,
            returnedAmount,
          }
        );

        return res.status(400).json({
          success: false,
          message:
            "The payment details do not match the recorded purchase. Access has not been activated.",
        });
      }

      // Never activate a transaction Paystack has not marked successful.
      if (verification.status !== "success") {
        if (
          ["failed", "abandoned", "reversed"].includes(
            verification.status
          )
        ) {
          purchase.status = "failed";
          await purchase.save();
        }

        return res.status(402).json({
          success: false,
          message:
            "International payment has not been confirmed as successful.",
          paymentStatus: verification.status,
        });
      }

      // Atomically activate the existing pending purchase.
      const purchasedAt = new Date();
      const accessExpiresAt = new Date(
        purchasedAt.getTime() +
          Number(purchase.accessDays) * 24 * 60 * 60 * 1000
      );

      const activatedPurchase =
        await InternationalPurchase.findOneAndUpdate(
          {
            _id: purchase._id,
            reference: purchase.reference,
            status: "pending",
          },
          {
            $set: {
              status: "success",
              purchasedAt,
              accessStartsAt: purchasedAt,
              accessExpiresAt,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

      // Another simultaneous verification may have activated it.
      const finalPurchase =
        activatedPurchase ||
        (await InternationalPurchase.findOne({
          _id: purchase._id,
          reference: purchase.reference,
          status: "success",
        }));

      if (
        !finalPurchase ||
        finalPurchase.status !== "success" ||
        !finalPurchase.accessStartsAt ||
        !finalPurchase.accessExpiresAt
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Payment was confirmed, but access activation could not be completed. Please retry verification.",
        });
      }

      console.info(
        "International payment verified and access activated:",
        {
          reference: finalPurchase.reference,
          examCodes: finalPurchase.examCodes,
          userId: String(finalPurchase.userId),
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "International payment verified and examination access activated successfully.",
        purchase: toPurchaseResponse(finalPurchase),
      });
    } catch (error) {
      console.error(
        "International payment verification error:",
        {
          message: error.message,
          status: error.response?.status,
          paystackResponse: error.response?.data,
        }
      );

      return res.status(502).json({
        success: false,
        message:
          "Unable to verify International payment at this time. Please retry verification. Do not make another payment.",
      });
    }
  }
);

/* ==========================================================
   CHECK EXISTING INTERNATIONAL EXAMINATION ACCESS

   GET /api/international/access/:examCode

   Authentication remains required.
========================================================== */

router.get(
  "/access/:examCode",
  authMiddleware,
  requireInternationalCandidate,
  async (req, res) => {
    try {
      const examCode = String(
        req.params.examCode || ""
      ).trim().toUpperCase();

      if (!examCode) {
        return res.status(400).json({
          success: false,
          message: "An examination code is required.",
        });
      }

      const userId = req.user?.id || req.user?._id;
      const now = new Date();

      const purchase = await InternationalPurchase.findOne({
        userId,
        status: "success",
        examCodes: examCode,
        accessStartsAt: { $lte: now },
        accessExpiresAt: { $gt: now },
      }).sort({ accessExpiresAt: -1 });

      return res.json({
        success: true,
        hasAccess: Boolean(purchase),
        examCode,
        purchase: purchase || null,
      });
    } catch (error) {
      console.error(
        "International examination access check failed:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to check examination access.",
      });
    }
  }
);

module.exports = router;
