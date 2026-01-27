import express from "express";
import { getAllServices, getDetailService, insertService, updateService, deleteService } from "../controllers/serviceController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getDetailService);
router.post("/", verifyToken, insertService);
router.put("/:id", verifyToken, updateService);
router.delete("/:id", verifyToken, deleteService);

export default router;