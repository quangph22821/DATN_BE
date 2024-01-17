import mongoose, { Types } from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    cartId: { type: Types.ObjectId, ref: "Cart" },
    shippingFee: Number,
    totalPrice: Number,
    totalOrder: Number,
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    commune: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Ví điện tử", "Thanh toán khi nhận hàng"],
      required: true,
    },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        name: String
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["Paid", "UnPaid"],
    },
    status: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Hủy đơn hàng",
        "Đã xác nhận",
        "Đã giao hàng",
        "Đang giao hàng",
      ],
      default: "Chờ xác nhận",
    },
  },
  { timestamps: true, versionKey: false }
);
billSchema.pre("save", function (next) {
  if (
    this.paymentMethod === "Ví điện tử"
  ) {
    this.paymentStatus = "Paid";
  } else {
    this.paymentStatus = "UnPaid";
  }
  next();
});

export default mongoose.model("Bill", billSchema);
