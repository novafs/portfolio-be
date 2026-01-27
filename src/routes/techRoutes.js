import express from "express";
import { getAllTechs, getDetailTech, insertTech, deleteTech, updateTech } from "../controllers/techController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllTechs);
router.get("/:id", getDetailTech);
router.post("/", verifyToken, upload.single("file"), insertTech);
router.put("/:id", verifyToken, upload.single("file"), updateTech);
router.delete("/:id", verifyToken, deleteTech);

export default router;