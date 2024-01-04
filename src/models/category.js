import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        img:{
            type: Array
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

export default mongoose.model("Category", categorySchema);
