const mongoose = require("mongoose");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Payment = require("../models/paymentSchema");
const Product = require("../models/productSchema");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { address, paymentMethod } = req.body;

    if (!paymentMethod || !["COD", "ONLINE"].includes(paymentMethod)) {
      throw new Error("Invalid payment method");
    }

    if (!address) {
      throw new Error("Shipping address is needed");
    }

    const cart = await Cart.findOne({ userId }).session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.productName}`);
      }

      // Deduct stock safely
      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        product: product._id,
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress: address,
          paymentMethod,
          orderStatus: "pending",
        },
      ],
      { session },
    );

    await Payment.create(
      [
        {
          userId,
          orderId: order[0]._id,
          paymentMethod,
          amount: totalAmount,
          status: "pending",
        },
      ],
      { session },
    );

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully",
      orderId: order[0]._id,
      totalAmount,
      paymentMethod,
      nextStep: paymentMethod === "ONLINE" ? "pay_now" : "order_confirmed",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").lean();

    const orderIds = orders.map((order) => order._id);
    const payments = await Payment.find(
      { orderId: { $in: orderIds } },
      "orderId status",
    ).lean();

    const paymentStatusByOrderId = new Map(
      payments.map((payment) => [payment.orderId.toString(), payment.status]),
    );

    const ordersWithPaymentStatus = orders.map((order) => ({
      ...order,
      paymentStatus:
        paymentStatusByOrderId.get(order._id.toString()) || "pending",
    }));

    res.status(200).json({
      message: "fetched all orders",
      data: ordersWithPaymentStatus,
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
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

    if (status === "shipped") {
      order.shippedAt = new Date();
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    if (status === "completed") {
      order.completedAt = new Date();
    }

    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }
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
  const session = await mongoose.startSession();

  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    await session.withTransaction(async () => {
      const order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          user: userId,
          orderStatus: { $in: ["pending", "processing"] },
        },
        {
          $set: { orderStatus: "cancelled" },
        },
        { new: true, session },
      );

      if (!order) {
        throw new Error("Order cannot be cancelled");
      }

      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: Number(item.quantity) } },
          { session },
        );
      }

      const payment = await Payment.findOne({ orderId: order._id }, null, {
        session,
      });

      if (payment && payment.paymentMethod === "ONLINE") {
        payment.status = "refunded";
        await payment.save({ session });
      }

      res.status(200).json({
        message: "Order cancelled successfully",
        orderId: order._id,
        status: order.orderStatus,
      });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
