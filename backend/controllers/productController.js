const Product = require("../models/productSchema");
const cloudinary = require("../config/cloudinary");

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
      status,
    } = req.body;

    let imageUrls = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "products" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }
    }

    const newProduct = await Product.create({
      productName,
      description,
      brand,
      price,
      stock,
      powerOutPut,
      channels,
      status,
      images: imageUrls,
    });

    res.status(201).json({
      message: "New product added ✅",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      message: "All products fetched successfully",
      count: products.length,
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
      return res.status(400).json("No product found");
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
    if (req.body.images) {
      delete req.body.images;
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(400).json("Product not fonud");
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
    //soft delete
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!product) {
      return res.status(404).json("Product not found");
    }

    res.status(200).json("Product moved to trash (soft deleted)");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
