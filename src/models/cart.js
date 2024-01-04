import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, ref: "User"
        },
        products: [
            {
                productId: { type: mongoose.Types.ObjectId, ref: "Product", },
                quantity: Number,
                // price: Number,
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", cartSchema);
