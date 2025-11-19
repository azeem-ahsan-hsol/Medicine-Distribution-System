import express from "express";
import { StockController } from "../controllers/stock.controller.js";
import { attachUser } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new StockController();

// Full stock grouped – any logged-in user
router.get("/", attachUser, (req, res, next) => controller.getStock(req, res, next));

// Near expiry – any logged-in user
router.get("/near-expiry", attachUser, (req, res, next) => controller.nearExpiry(req, res, next));

// Low stock – any logged-in user
router.get("/low", attachUser, (req, res, next) => controller.lowStock(req, res, next));

// All batches of a product – any logged-in user
router.get("/:productId", attachUser, (req, res, next) => controller.getProductBatches(req, res, next));

// Single batch detail – any logged-in user
router.get("/batch/:batchId", attachUser, (req, res, next) => controller.getBatchDetail(req, res, next));

export default router;
