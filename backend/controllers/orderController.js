const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Payment = require("../models/paymentSchema");
const Product = require("../models/productSchema");
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod } = req.body;

    if (!paymentMethod || !["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    if (!address) {
      return res.status(400).json({ message: "Shipping address is needed" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.productName}` });
      }

      orderItems.push({
        product: product._id,
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: address,
      paymentMethod,
      orderStatus: "pending",
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    await Payment.create({
      userId,
      orderId: order._id,
      paymentMethod,
      amount: totalAmount,
      status: "pending",
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      totalAmount,
      paymentMethod,
      nextStep: paymentMethod === "online" ? "pay_now" : "order_confirmed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.status(200).json({
      message: "fetched all orders",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("items totalAmount orderStatus paymentMethod createdAt");

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrders = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "delivered") {
      return res
        .status(400)
        .json({ message: "Delivered order cannot be updated" });
    }

    if (
      order.orderStatus === "shipped" &&
      ["pending", "processing"].includes(status)
    ) {
      return res.status(400).json({
        message: "Cannot revert status after shipping",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      orderId: order._id,
      newStatus: status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["pending", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    const payment = await Payment.findOne({ orderId: order._id });

    if (payment && payment.paymentMethod === "online") {
      payment.status = "refunded"; 
      await payment.save();
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      orderId: order._id,
      status: order.orderStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
