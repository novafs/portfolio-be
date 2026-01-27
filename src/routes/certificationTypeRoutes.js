import express from "express";
import { getAllCertificationTypes, getDetailCertificationType, insertCertificationType, updateCertificationType, deleteCertificationType } from "../controllers/certificationTypeController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCertificationTypes);
router.get("/:id", getDetailCertificationType);
router.post("/", verifyToken, insertCertificationType);
router.put("/:id", verifyToken, updateCertificationType);
router.delete("/:id", verifyToken, deleteCertificationType);

export default router;