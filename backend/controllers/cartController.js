const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");

exports.addCart = async (req, res) => {
  const { product, quantity } = req.body;
  const userId = req.user.id;

  try {
    // 1. Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // 2. Find product
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3. Check stock
    if (quantity > productData.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const price = productData.price;

    // 4. Find user's cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product,
      );

      if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + quantity;

        if (newQty > productData.stock) {
          return res.status(400).json({ message: "Stock limit exceeded" });
        }

        cart.items[itemIndex].quantity = newQty;
      } else {
        cart.items.push({ product, quantity, price });
      }

      await cart.save();
      return res.status(200).json(cart);
    }

    // 5. Create new cart
    const newCart = await Cart.create({
      userId,
      items: [{ product, quantity, price }],
    });

    return res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
