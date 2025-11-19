import express from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new PurchaseController();

// Create a purchase – only admins
router.post("/", attachUser, adminOnly, (req, res, next) => controller.create(req, res, next));

// Get all purchases – any logged-in user
router.get("/", attachUser, (req, res, next) => controller.getAll(req, res, next));

// Get single purchase with items – any logged-in user
router.get("/:id", attachUser, (req, res, next) => controller.getById(req, res, next));

export default router;
