const axios = require("axios");

async function test() {
  try {
    const res = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: "test@gmail.com",
        amount: 50000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PAYSTACK OK:", res.data);
  } catch (err) {
    console.log("PAYSTACK ERROR:", err.response?.data || err.message);
  }
}

test();