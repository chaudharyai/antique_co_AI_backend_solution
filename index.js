require("dotenv").config();
import express from "express";
import { json, urlencoded } from "body-parser";
import paymentRoutes from "./routes/paymentRoutes";
import healthRoutes from "./routes/healthRoutes";
import validateRequest from "./middlewares/validateRequest";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/payment", validateRequest, paymentRoutes);
app.use("/api/health", healthRoutes);

// Error Handling Middleware (last in the chain)
app.use(errorHandler);

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.PAYPAL_MODE || "sandbox"} mode on port ${PORT}`);
});
