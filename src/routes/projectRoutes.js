import express from "express";
import { getAllProjects, getDetailProject, insertProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getDetailProject);
router.post("/", verifyToken, upload.single("file"), insertProject);
router.put("/:id", verifyToken, upload.single("file"), updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;