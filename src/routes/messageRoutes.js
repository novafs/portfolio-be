import express from "express";
import { getAllMessages, getDetailMessage, insertMessage, updateMessage, deleteMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllMessages);
router.get("/:id", getDetailMessage);
router.post("/", insertMessage);
router.put("/:id", verifyToken, updateMessage);
router.delete("/:id", verifyToken, deleteMessage);

export default router;