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
      default: "Zonyfy",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
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
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["In Stock", "Out Of Stock"],
      default: "In Stock",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
