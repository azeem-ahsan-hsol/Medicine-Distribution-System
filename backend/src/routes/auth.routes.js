import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const authController = new AuthController();

router.post("/login",  (req, res, next) => authController.login(req, res, next));
router.post("/register", (req, res, next) => authController.register(req, res, next));

export default router;
