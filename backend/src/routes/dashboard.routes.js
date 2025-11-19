import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { attachUser } from "../middlewares/auth.middleware.js";

const router = express.Router();
const controller = new DashboardController();

router.get("/summary", attachUser,(req, res, next) => controller.summary(req, res, next));

export default router;
