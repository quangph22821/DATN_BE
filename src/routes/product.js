import { getAll } from "../controllers/product";
import express from "express";
const router = express.Router();

router.get("/products", getAll)