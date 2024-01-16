

import express from "express";
import {  getOrderSuccessRate, getTopSellingProducts, getTotalPriceByMonth, getTotalPriceByYear } from "../controllers/static";

const router = express.Router();

router.get(`/bymonth`, getTotalPriceByMonth);
router.get(`/byyear`, getTotalPriceByYear);
router.get("/topCategory", getTopSellingProducts);
router.get("/rate", getOrderSuccessRate);

export default router;

