// backend/src/routes/slotRoutes.ts
import express from "express";
import { getAllSlots, bookSlot } from "../controllers/slotController";

const router = express.Router();

router.get("/", getAllSlots);
router.post("/book", bookSlot);

export default router;
