require("dotenv").config();
import express from "express";
import { json, urlencoded } from "body-parser";
import { configure, payment as _payment } from "paypal-rest-sdk";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

// Configure PayPal SDK (No session cookies or fraud detection)
configure({
  mode: "live", // Use "sandbox" for testing, "live" for production
  client_id: process.env.PAYPAL_CLIENT_ID, // Registered organization's Client ID
  client_secret: process.env.PAYPAL_CLIENT_SECRET, // Registered organization's Secret
});

// Manual Payment Route
app.post("/manual-payment", (req, res) => {
  const { card_number, type, expire_month, expire_year, cvv, total } = req.body;

  const paymentDetails = {
    intent: "sale",
    payer: {
      payment_method: "credit_card",
      funding_instruments: [
        {
          credit_card: {
            number: card_number,
            type: type, // Card type (visa, mastercard)
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
          currency: "USD", // Adjust currency as per your PayPal account's setup
        },
        description: "Manual Payment Capture - Organization Trusted",
      },
    ],
  };

  // Call PayPal API
  _payment.create(paymentDetails, (error, payment) => {
    if (error) {
      console.error("Payment Failed:", error.response);
      return res.status(500).json({ error: "Payment failed. Please check card details." });
    } else {
      console.log("Payment Success:", payment);
      return res.status(200).json({ message: "Payment successfully captured.", payment });
    }
  });
});

// Test Route
app.get("/", (req, res) => {
  res.send("Payment Backend is Ready!");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
