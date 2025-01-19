const express = require("express");
const router = express.Router();
const paypal = require("paypal-rest-sdk");
const moment = require("moment-timezone");

// PayPal Configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // "sandbox" or "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Payment Capture Route
router.post("/manual-payment", async (req, res, next) => {
  const { card_number, type, expire_month, expire_year, cvv, total, currency, userTimezone, userRegion } = req.body;

  try {
    // Log timezone for compliance
    const utcTime = moment().utc().format();
    const localTime = moment(utcTime).tz(userTimezone || "UTC").format("YYYY-MM-DD HH:mm:ss");
    console.log(`Transaction from ${userRegion}, Local Time: ${localTime}`);

    // Payment Details
    const paymentDetails = {
      intent: "sale",
      payer: {
        payment_method: "credit_card",
        funding_instruments: [
          {
            credit_card: {
              number: card_number,
              type: type.toLowerCase(),
              expire_month: expire_month,
              expire_year: expire_year,
              cvv2: cvv,
              first_name: "Registered",
              last_name: "Customer",
            },
          },
        ],
      },
      transactions: [
        {
          amount: {
            total: total,
            currency: currency || "USD",
          },
          description: "Manual Payment Capture - Compliant Backend",
        },
      ],
    };

    // Process Payment
    paypal.payment.create(paymentDetails, (error, payment) => {
      if (error) {
        console.error("PayPal Error:", error.response);
        return res.status(500).json({ error: "Payment failed. Check card details or region settings." });
      } else {
        console.log("Payment Success:", payment);
        return res.status(200).json({
          message: "Payment successfully captured!",
          payment,
          transactionTime: localTime,
        });
      }
    });
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

module.exports = router;
