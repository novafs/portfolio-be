import express from "express";
import { getAllCertifications, getDetailCertification, insertCertification, updateCertification, deleteCertification } from "../controllers/certificationController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllCertifications);
router.get("/:id", getDetailCertification);
router.post("/", verifyToken, upload.single("file"), insertCertification);
router.put("/:id", verifyToken, upload.single("file"), updateCertification);
router.delete("/:id", verifyToken, deleteCertification);
export default router;