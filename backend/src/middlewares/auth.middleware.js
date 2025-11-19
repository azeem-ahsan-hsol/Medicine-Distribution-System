// src/middlewares/auth.middleware.js
import { verifyJwt } from "../utils/jwt.util.js";
import { User } from "../models/user.model.js";

/**
 * attachUser middleware: verifies JWT in Authorization header and sets req.user
 */
export const attachUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    const payload = verifyJwt(token);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token user" });

    // attach minimal user
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * adminOnly middleware: require req.user.role === 'admin'
 * Use after attachUser
 */
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Admin only" });
    next();
  } catch (err) {
    next(err);
  }
};
