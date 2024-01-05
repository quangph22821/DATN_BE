import express from "express";

import { create, get, getAll , remove, update} from "../controllers/origin";
import { checkPermission } from "../middlewares/checkPermission";

const router = express.Router();
router.get("/origin", getAll);
router.get("/origin/:id", get);
router.post("/origin",checkPermission,  create);
router.delete("/origin/:id",checkPermission, remove);
router.put("/origin/:id",checkPermission,  update);

export default router;