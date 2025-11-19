import express from "express";
import { SupplierController } from "../controllers/supplier.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const supplierController = new SupplierController();

// Get all suppliers – any logged-in user
router.get("/", attachUser, (req, res, next) => supplierController.getAll(req, res, next));

// Create supplier – admin only
router.post("/", attachUser, adminOnly, (req, res, next) => supplierController.create(req, res, next));

// Get single supplier by ID – any logged-in user
router.get("/:id", attachUser, (req, res, next) => supplierController.getById(req, res, next));

// Update supplier – admin only
router.put("/:id", attachUser, adminOnly, (req, res, next) => supplierController.update(req, res, next));

// Delete supplier – admin only
router.delete("/:id", attachUser, adminOnly, (req, res, next) => supplierController.delete(req, res, next));

export default router;
