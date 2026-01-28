const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      enum: ["Amplifier", "Speaker"],
      default: "Amplifier",
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    brand: {
      type: String,
      default: "Zonify",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: String,
      required: true,
      min: 0,
      default: 0,
    },
    powerOutPut: {
      type: Number,
      required: true,
      min: 0,
    },
    channels: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["In Stock", "Out Of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
