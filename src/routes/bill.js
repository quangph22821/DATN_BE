import express from "express";
import { authenticate } from "../middlewares/authenticate";
import {  cancelBill, getBill, getBills, getUserBills, updateBill } from "../controllers/bill";
import { checkPermission } from "../middlewares/checkPermission";

const router = express.Router();

router.get("/bills", authenticate, checkPermission, getBills);
router.get("/bills/user/:userId", authenticate, getUserBills);
router.get("/bills/:billId", authenticate, getBill);
router.put("/bills/update/:billId", authenticate,updateBill);
router.put("/bills/cancel/status/:billId", authenticate, cancelBill);

export default router;