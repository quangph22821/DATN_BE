import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "member"
        },
        cartId: {
            type: mongoose.Types.ObjectId,
            ref: "Cart",
        },
        billsId: [{ type: Types.ObjectId, ref: "Bill" }]

    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);