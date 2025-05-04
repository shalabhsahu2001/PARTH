// backend/src/routes/slotRoutes.ts
import express from "express";
import { getAllSlots, bookSlot, getOccupiedSlots } from "../controllers/slotController";

const router = express.Router();

router.get("/", getAllSlots);
router.post("/book", bookSlot);
router.get("/occupied-slots", getOccupiedSlots);
export default router;
