import express from "express";

import cors from "cors"


const app = express();
app.use(cors());
//middleware
app.use(express.json());

// router
app.use("", productRouter);
app.use("", categoryRouter);
app.use("", authRouter);
app.use("", cartRouter);
app.use("", materialRouter);
app.use("", originRouter);
app.use("", userRouter);
app.use("", billRouter);



mongoose.connect("mongodb://127.0.0.1:27017/duantotnghiep");

export const viteNodeApp = app;