import express from "express";
import { ReportController } from "../controllers/report.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new ReportController();

// SALES – any logged-in user
router.get("/sales", attachUser, (req, res, next) => controller.salesReport(req, res, next));

// PURCHASE – any logged-in user
router.get("/purchases", attachUser, (req, res, next) => controller.purchaseReport(req, res, next));

// STOCK – any logged-in user
router.get("/stock", attachUser, (req, res, next) => controller.stockReport(req, res, next));

// NEAR EXPIRY – any logged-in user
router.get("/near-expiry", attachUser, (req, res, next) => controller.nearExpiryReport(req, res, next));

// PROFIT-LOSS – admin only
router.get("/profit-loss", attachUser, adminOnly, (req, res, next) => controller.profitLossReport(req, res, next));

// CUSTOMER LEDGER – any logged-in user
router.get("/customer-ledger/:id", attachUser, (req, res, next) => controller.customerLedger(req, res, next));

// SUPPLIER LEDGER – any logged-in user
router.get("/supplier-ledger/:id", attachUser, (req, res, next) => controller.supplierLedger(req, res, next));

// DAILY SUMMARY – any logged-in user
router.get("/daily-summary", attachUser, (req, res, next) => controller.dailySummary(req, res, next));

// PRODUCT-WISE SALES – any logged-in user
router.get("/product-sales", attachUser, (req, res, next) => controller.productSales(req, res, next));

// BATCH-WISE STOCK – any logged-in user
router.get("/batch-stock/:productId", attachUser, (req, res, next) => controller.batchStock(req, res, next));

export default router;
