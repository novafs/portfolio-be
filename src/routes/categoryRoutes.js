import express from "express";
import { getAllCategories, getDetailCategory, insertCategory, deleteCategory, updateCategory } from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getDetailCategory);
router.post("/", verifyToken, insertCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;