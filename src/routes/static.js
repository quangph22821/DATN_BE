import express from "express";

import { } from "../controllers/origin";
import { getToalPrice, getTotalPriceByMonth } from "../controllers/static";


const router = express.Router();
router.get("/toal", getToalPrice);
router.get("/bydate", getTotalPriceByMonth);

export default router;