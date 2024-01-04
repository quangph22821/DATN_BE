import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        img: {
            type: Array,
        },
        price: {
            type: Number,
        },
        description:{
            type:String,
        },
        height:{
            type:Number
        },
        weight:{
            type:Number,
        },
        originId:{
            type:mongoose.Types.ObjectId,
            ref:"Origin"
        },
        materialId:{
            type:mongoose.Types.ObjectId,
            ref:"Material"
        },
        categoryId:{
            type:mongoose.Types.ObjectId,
            ref:"Category"
        },
        cartId: {
            type: mongoose.Types.ObjectId,
            ref: "Cart",
        },

    },
    { timestamps: true, versionKey: false }

);


export default mongoose.model("Product", productSchema);