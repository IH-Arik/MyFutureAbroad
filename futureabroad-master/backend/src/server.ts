import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import webhookRoutes from "./routes/webhooks.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import providerRoutes from "./routes/providers.js";
import translateRoutes from "./routes/translate.js";
import supportRoutes from "./routes/support.js";
import taxRoutes from "./routes/tax.js";
import countryProfilesRoutes from "./routes/countryProfiles.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// ============================================================
// STRIPE WEBHOOK - Must come BEFORE express.json()
// ============================================================
app.use("/api/payment", webhookRoutes); // webhooks.ts binds to /webhook which correctly produces /api/payment/webhook

// Apply JSON parser with size limits to prevent DoS from large payloads
// Default limit is 100kb for most endpoints
app.use(express.json({ limit: "100kb" }));

// Chat messages can be longer, use a larger limit for that specific route
app.use("/api/chat/message", express.json({ limit: "1mb" }));

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// ============================================================
// ROUTES
// ============================================================
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes); // Handles /checkout, /checkout-request
app.use("/api/payments", paymentRoutes); // Handles /intent
app.use("/api/providers", providerRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/country-profiles", countryProfilesRoutes);
app.use("/api/chat", chatRoutes);

// ============================================================
// ERROR HANDLER (must be last middleware)
// ============================================================
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Don't send multiple response headers
  if (res.headersSent) {
    console.error("[error] Headers already sent:", err);
    return;
  }

  // Log error with context
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  console.error(`[error ${errorId}] ${req.method} ${req.path}:`, err);

  // Determine status code
  let statusCode = 500;
  if (err.statusCode) statusCode = err.statusCode;
  if (err.status) statusCode = err.status;
  if (err.code === "LIMIT_PART_COUNT") statusCode = 413; // Payload too large

  // Return generic error message (don't leak internals)
  res.status(statusCode).json({
    error: "Internal server error",
    errorId, // For debugging - user can report this ID
  });
});

// ============================================================
// 404 HANDLER
// ============================================================
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.info(`[server] Backend running on port ${PORT}`);
});
