const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
exports.addCart = async (req, res) => {
  const userId = req.user.id;
  const { product, quantity } = req.body.items?.[0] || {};

  try {
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (qty > productData.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const price = productData.price;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product,
      );

      if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + qty;

        if (newQty > productData.stock) {
          return res.status(400).json({ message: "Stock limit exceeded" });
        }

        cart.items[itemIndex].quantity = newQty;
      } else {
        cart.items.push({ product, quantity: qty, price });
      }

      await cart.save();
      return res.status(200).json(cart);
    }

    const newCart = await Cart.create({
      userId,
      items: [{ product, quantity: qty, price }],
    });

    return res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  const  userId  = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.product",
      "productName price stock images",
    );

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }

    let total = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        total += item.quantity * item.price;
      }
    });

    res.status(200).json({
      cart,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try{
   const userId = req.user._id;
    const { product, quantity } = req.body.items?.[0] || {};

    const qty = Number(quantity);

    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }

    if (!Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    // remove item
    if (qty === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (qty > productData.stock) {
        return res.status(400).json({ message: "Stock limit exceeded" });
      }

      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product } = req.body.items?.[0] || {};

    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
