import express from "express";

// import { checkPermission } from "../middlewares/checkPermission";
import { getAll, getUserProfile, remove, update } from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();
router.get("/user", getAll);
router.get("/user/profile", authenticate ,getUserProfile);
router.delete("/user/:id",remove);
router.put("/user/:id", update);

export default router;