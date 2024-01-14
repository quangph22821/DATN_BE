import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { addToCart, checkOut, deleteAllProductCart, deleteProductCart, getCart, getCarts, updateCart } from "../controllers/cart";

const router = express.Router();

router.get("/cart",authenticate, getCarts);
router.get("/cart/user", authenticate, getCart);
router.post("/cart/add", authenticate, addToCart);
router.put("/cart/update", authenticate, updateCart);
router.delete("/cart/delete/:productId", authenticate, deleteProductCart);
router.delete("/cart/delete-all", authenticate, deleteAllProductCart);
router.post("/cart/checkout", authenticate, checkOut);


export default router;