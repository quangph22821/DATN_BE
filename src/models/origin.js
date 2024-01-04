import mongoose from "mongoose";

const originSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        productId: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Origin", originSchema);