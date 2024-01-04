import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, ref: "User"
        },
        cartId: {
            type: mongoose.Types.ObjectId, ref: "Cart"
        },
        phone: {
            type: Number,
        },
        name: {
            type: String,
        },
        location: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Cancelled", "Confirmed", "Delivering", "Delivered"],
            default: "Pending",
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Bill", billSchema);