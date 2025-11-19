import express from "express";
import { InvoiceController } from "../controllers/invoice.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const invoiceController = new InvoiceController();

// Sales Invoice PDF – only admins
router.get("/sales/:id", attachUser, adminOnly, (req, res, next) =>
  invoiceController.generateSalesInvoice(req, res, next)
);

// Purchase Invoice PDF – only admins
router.get("/purchase/:id", attachUser, adminOnly, (req, res, next) =>
  invoiceController.generatePurchaseInvoice(req, res, next)
);

export default router;
