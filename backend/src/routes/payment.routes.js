import express from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new PaymentController();

// CUSTOMER PAYMENTS
router.post("/customer", attachUser, adminOnly, (req, res, next) => controller.customerPay(req, res, next)); // only admins can record payments
router.get("/customer/:id", attachUser, (req, res, next) => controller.customerLedger(req, res, next)); // any logged-in user can view ledger

// SUPPLIER PAYMENTS
router.post("/supplier", attachUser, adminOnly, (req, res, next) => controller.supplierPay(req, res, next)); // only admins
router.get("/supplier/:id", attachUser, (req, res, next) => controller.supplierLedger(req, res, next)); // any logged-in user

// ALL PAYMENTS HISTORY
router.get("/history", attachUser, (req, res, next) => controller.history(req, res, next)); // any logged-in user

export default router;
