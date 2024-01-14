import express from "express";
import commentRouter from "./routes/comment"
import productRouter from "./routes/product";
import authRouter from "./routes/auth";
import categoryRouter from "./routes/category";
// import cartRouter from "./routes/cart";
import materialRouter from "./routes/material";
import originRouter from "./routes/origin";
import userRouter from "./routes/user";
import staticRouter from"./routes/static"
// import billRouter from"./routes/bill"
import cors from "cors"
import mongoose from "mongoose";


const app = express();
app.use(cors());
//middleware
app.use(express.json());

// router
app.use("", productRouter );
app.use("", categoryRouter);
app.use("", authRouter);
// app.use("", cartRouter);
app.use("", materialRouter);
app.use("", originRouter);
app.use("", userRouter);
// app.use("", billRouter);
app.use("", commentRouter)
app.use("", staticRouter);



mongoose.connect("mongodb://127.0.0.1:27017/duantotnghiep");

export const viteNodeApp = app;