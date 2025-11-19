import express from "express";
import { SalesController } from "../controllers/sales.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new SalesController();

// Create sale + FEFO deduction – admin only
router.post("/", attachUser, adminOnly, (req, res, next) => controller.create(req, res, next));

// Get all sales – any logged-in user
router.get("/", attachUser, (req, res, next) => controller.getAll(req, res, next));

// Get single sale with items – any logged-in user
router.get("/:id", attachUser, (req, res, next) => controller.getById(req, res, next));

export default router;
