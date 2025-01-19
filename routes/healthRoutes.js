const express = require("express");
const router = express.Router();

// Simple Health Check Route
router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Payment backend is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
