const Product = require("../models/productSchema");

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      brand,
      price,
      stock,
      powerOutPut,
      channels,
      images,
      status,
    } = req.body;

    const newProduct = await Product.create({
      productName,
      description,
      brand,
      price,
      stock,
      powerOutPut,
      channels,
      images,
      status,
    });
    res.status(200).json({ message: "New product added✅", newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      res.status(400).json("No products found");
    }
    res.status(200).json({
      message: "All products",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(400).json("No product found");
    }
    res.status(200).json({
      message: "Product found",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(400).json("Product not fonud");
    }
    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(400).json("Product not fonud");
    }
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
