import express from "express";
import { ReturnController } from "../controllers/return.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new ReturnController();

// Sales returns
router.post("/sales", attachUser, adminOnly, (req, res, next) => controller.createSalesReturn(req, res, next)); // admin only
router.get("/sales", attachUser, (req, res, next) => controller.getSalesReturns(req, res, next)); // any logged-in user

// Purchase returns
router.post("/purchase", attachUser, adminOnly, (req, res, next) => controller.createPurchaseReturn(req, res, next)); // admin only
router.get("/purchase", attachUser, (req, res, next) => controller.getPurchaseReturns(req, res, next)); // any logged-in user

export default router;
