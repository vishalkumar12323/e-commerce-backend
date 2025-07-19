import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.post("/create", createProduct);
router.put("/update/:productId", updateProduct);
router.delete("/delete/:productId", deleteProduct);

export default router;
