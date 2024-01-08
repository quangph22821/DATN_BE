import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema(
    {
      userId: { type: Types.ObjectId, ref: "User" },
      products: [
        {
          productId: { type: Types.ObjectId, ref: "Product" },
          quantity: Number,
          price: Number,
        },
      ],
      shippingFee: Number,
      totalPrice: Number,
      totalOrder: Number,
      createdAt: Date,
      updatedAt: Date,
    },
    { versionKey: false, timestamps: true }
  );

export default mongoose.model("Cart", cartSchema);
