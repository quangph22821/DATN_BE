import express from "express";

import { create, get, getAll , remove, update} from "../controllers/material";
import { checkPermission } from "../middlewares/checkPermission";


const router = express.Router();
router.get("/material", getAll);
router.get("/material/:id", get);
router.post("/material",checkPermission,create);
router.delete("/material/:id",checkPermission, remove);
router.put("/material/:id",checkPermission,  update);

export default router;