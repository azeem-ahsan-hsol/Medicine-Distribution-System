import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import returnRoutes from "./routes/return.routes.js";
import reportRoutes from "./routes/report.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import settingsRoutes from "./routes/setting.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
// import logRoutes from "./routes/log.routes.js";
// import backupRoutes from "./routes/backup.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// ----------------- CORS SETUP -----------------
app.use(
  cors({
    origin: "*",          // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ------- API ROUTES -------- //
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/logs", logRoutes);
// app.use("/api/backup", backupRoutes);

// Error Handler (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
