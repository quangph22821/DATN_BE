import express from "express";
// import { checkPermission } from "../middlewares/checkPermission";
import { getAll,remove,update, getUserProfile } from "../controllers/user";
// import { authenticate } from "../middlewares/authenticate";

const router = express.Router();
router.get("/user", getAll);
router.get("/user/profile",getUserProfile);
router.delete("/user/:id",remove);
router.put("/user/:id", update);

export default router;