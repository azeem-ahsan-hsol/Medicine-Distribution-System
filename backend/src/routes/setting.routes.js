import express from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new SettingsController();

// Get all settings – any logged-in user
router.get("/", attachUser, (req, res, next) => controller.getAll(req, res, next));

// Update settings (bulk update) – admin only
router.post("/", attachUser, adminOnly, (req, res, next) => controller.update(req, res, next));

// Get a single setting by key – any logged-in user
router.get("/:key", attachUser, (req, res, next) => controller.getOne(req, res, next));

export default router;
