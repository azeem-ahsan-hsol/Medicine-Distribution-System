import express from "express";
import { CustomerController } from "../controllers/customer.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new CustomerController();

// 🔍 Search customers
router.get("/search", attachUser, (req, res, next) => controller.search(req, res, next));

// Any authenticated user can get all customers
router.get("/", attachUser, (req, res, next) => controller.getAll(req, res, next));

// Only admins can create a customer
router.post("/", attachUser, adminOnly, (req, res, next) => controller.create(req, res, next));

// Any authenticated user can get a single customer by ID
router.get("/:id", attachUser, (req, res, next) => controller.getById(req, res, next));

// Only admins can update a customer
router.put("/:id", attachUser, adminOnly, (req, res, next) => controller.update(req, res, next));

// Only admins can delete a customer
router.delete("/:id", attachUser, adminOnly, (req, res, next) => controller.delete(req, res, next));

export default router;
