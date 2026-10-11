
const axios = require("axios");

/* ==========================================================
   SMARTEXAM INTERNATIONAL — EXCHANGE RATE SERVICE

   Reference source: Frankfurter CBN provider
   Reference pair: USD / NGN

   This file does not initialize or verify payments.
========================================================== */

const RATE_URL =
  "https://api.frankfurter.dev/v2/providers/cbn/rates";

const MAX_RATE_AGE_DAYS = 3;
const ROUNDING_UNIT_NGN = 100;

const INTERNATIONAL_PACKAGES = {
  SINGLE: {
    code: "SINGLE",
    usdPrice: 5,
    accessDays: 3,
    examCount: 1,
  },

  BUNDLE_3: {
    code: "BUNDLE_3",
    usdPrice: 12,
    accessDays: 7,
    examCount: 3,
  },
};

/* ==========================================================
   GET AND VALIDATE USD / NGN RATE
========================================================== */

async function getUsdNgnRate() {
  const response = await axios.get(RATE_URL, {
    params: {
      base: "USD",
      quotes: "NGN",
    },
    timeout: 10000,
  });

  if (!Array.isArray(response.data)) {
    throw new Error(
      "The exchange-rate provider returned an invalid response."
    );
  }

  const record = response.data.find(
    (item) =>
      item.base === "USD" &&
      item.quote === "NGN"
  );

  if (
    !record ||
    !Number.isFinite(record.rate) ||
    record.rate <= 0 ||
    typeof record.date !== "string"
  ) {
    throw new Error(
      "A valid USD/NGN exchange rate was not returned."
    );
  }

  const rateDate = new Date(
    `${record.date}T00:00:00.000Z`
  );

  if (Number.isNaN(rateDate.getTime())) {
    throw new Error(
      "The exchange-rate date is invalid."
    );
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const rateDayUtc = Date.UTC(
    rateDate.getUTCFullYear(),
    rateDate.getUTCMonth(),
    rateDate.getUTCDate()
  );

  const ageDays =
    Math.floor(
      (todayUtc - rateDayUtc) /
      (24 * 60 * 60 * 1000)
    );

  if (ageDays < 0 || ageDays > MAX_RATE_AGE_DAYS) {
    throw new Error(
      `The USD/NGN rate is stale or future-dated. ` +
      `Rate date: ${record.date}.`
    );
  }

  return {
    base: "USD",
    quote: "NGN",
    rate: record.rate,
    rateDate: record.date,
    provider: "Frankfurter CBN provider",
    retrievedAt: new Date().toISOString(),
  };
}

/* ==========================================================
   ROUND UP TO THE NEXT ₦100
========================================================== */

function roundUpToNaira100(amount) {
  return (
    Math.ceil(amount / ROUNDING_UNIT_NGN) *
    ROUNDING_UNIT_NGN
  );
}

/* ==========================================================
   CALCULATE INTERNATIONAL PACKAGE PRICES
========================================================== */

async function getInternationalPricing() {
  const exchangeRate = await getUsdNgnRate();

  const packages = Object.values(
    INTERNATIONAL_PACKAGES
  ).map((item) => {
    const convertedAmount =
      item.usdPrice * exchangeRate.rate;

    return {
      code: item.code,
      usdReferencePrice: item.usdPrice,
      currency: "NGN",
      amountNgn: roundUpToNaira100(
        convertedAmount
      ),
      accessDays: item.accessDays,
      examCount: item.examCount,
    };
  });

  return {
    success: true,
    exchangeRate,
    packages,
  };
}

module.exports = {
  getUsdNgnRate,
  getInternationalPricing,
  INTERNATIONAL_PACKAGES,
};

/* ==========================================================
   OPTIONAL DIRECT TEST
========================================================== */

if (require.main === module) {
  getInternationalPricing()
    .then((result) => {
      console.log(
        JSON.stringify(result, null, 2)
      );
    })
    .catch((error) => {
      console.error(
        "International pricing test failed:",
        error.message
      );

      process.exitCode = 1;
    });
}

