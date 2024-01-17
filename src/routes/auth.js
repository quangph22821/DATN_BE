import { Router } from "express";
import { forgotPassword, signin, signup, update } from "../controllers/auth";

const routerAuth = Router();

routerAuth.post("/signup", signup);
routerAuth.post("/signin", signin);
routerAuth.post("/forgotpassword", forgotPassword);
routerAuth.put("/user/:id", update);
export default routerAuth;