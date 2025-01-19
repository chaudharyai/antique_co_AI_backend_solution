const moment = require("moment-timezone");

// Middleware to Validate Request Data
const validateRequest = (req, res, next) => {
  const { card_number, type, expire_month, expire_year, cvv, total, userTimezone, userRegion } = req.body;

  // Check Required Fields
  if (!card_number || !type || !expire_month || !expire_year || !cvv || !total || !userTimezone || !userRegion) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate Card Number
  if (card_number.length !== 16 || isNaN(card_number)) {
    return res.status(400).json({ error: "Invalid card number. Must be 16 digits." });
  }

  // Validate Card Type
  if (!["visa", "mastercard"].includes(type.toLowerCase())) {
    return res.status(400).json({ error: "Unsupported card type. Use 'visa' or 'mastercard'." });
  }

  // Validate CVV
  if (cvv.length !== 3 || isNaN(cvv)) {
    return res.status(400).json({ error: "Invalid CVV. Must be 3 digits." });
  }

  // Validate Expiry Date
  const currentYear = parseInt(moment().format("YYYY"), 10);
  const currentMonth = parseInt(moment().format("MM"), 10);
  if (
    expire_year < currentYear ||
    (expire_year === currentYear && expire_month < currentMonth)
  ) {
    return res.status(400).json({ error: "Card has expired." });
  }

  next();
};

module.exports = validateRequest;
