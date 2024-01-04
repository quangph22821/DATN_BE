import mongoose from "mongoose";

export const commentModel = new mongoose.Schema(
    {
        userId:
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
        ,
        comment: {
            comment: String
        },
        rate: {
            type: Object
        },
        productId: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    { timestamps: true, versionKey: false }
)
export default mongoose.model("comment", commentModel)