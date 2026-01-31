const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    paymentGateway: {
      type: String,
      enum: ["stripe", "paypal", "razorpay"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "online"],
    },
    paymentMode: {
      type: String,
      enum: ["card", "upi"],
    },
    amount: {
      type: Number,
      required: true,
      min:1
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
