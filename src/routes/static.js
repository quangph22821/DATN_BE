

import express from "express";
import {  getOrderSuccessRate, getTopSellingProducts, getTotalPriceByMonth, getTotalPriceByWeek, getTotalPriceByYear } from "../controllers/static";

const router = express.Router();
// router.get("/bydate", getTotalPriceByDay);
router.get(`/bymonth`, getTotalPriceByMonth);
router.get(`/byweek`, getTotalPriceByWeek);
router.get(`/byyear`, getTotalPriceByYear);
router.get("/topCategory", getTopSellingProducts);
router.get("/rate", getOrderSuccessRate);

export default router;

