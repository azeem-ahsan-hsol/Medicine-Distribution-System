import express from "express";
import { ProductController } from "../controllers/product.controller.js";
import { attachUser, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();
const productController = new ProductController();

//search products - any logged-in user
router.get("/search", attachUser, (req, res, next) => productController.search(req, res, next));
// Any logged-in user can get all products
router.get("/", attachUser, (req, res, next) => productController.getAll(req, res, next));

// Only admins can create a new product
router.post("/", attachUser, adminOnly, (req, res, next) => productController.create(req, res, next));

// Only admins can update a product
router.put("/:id", attachUser, adminOnly, (req, res, next) => productController.update(req, res, next));

// Only admins can delete a product
router.delete("/:id", attachUser, adminOnly, (req, res, next) => productController.delete(req, res, next));

// get product by id - any logged-in user
router.get("/:id", attachUser, (req, res, next) => productController.getById(req, res, next));



export default router;
