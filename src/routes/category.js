import express from "express";

import { create, get, getAll , deleteCate, update} from "../controllers/category";
import { checkPermission } from "../middlewares/checkPermission";


const router = express.Router();
router.get("/category", getAll);
router.get("/category/:id", get);
router.post("/category",checkPermission, create);
router.delete("/category/:id",checkPermission, deleteCate);
router.put("/category/:id",checkPermission, update);

export default router;
