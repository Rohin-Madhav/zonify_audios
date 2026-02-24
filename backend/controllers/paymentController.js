require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentSchema");
const Order = require("../models/orderSchema");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initializeRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    //  Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ownership check
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Must be online payment
    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        message: "This order is not for online payment",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        message: "Order cannot be paid at this stage",
      });
    }

    //  Find payment record
    const payment = await Payment.findOne({ orderId: order._id });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        message: "Payment already processed",
      });
    }

    //  Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    // 4 Store razorpay order id
    payment.transactionId = razorpayOrder.id;
    payment.paymentGateway = "razorpay";
    await payment.save();

    //  Send data to frontend
    res.status(200).json({
      message: "Razorpay order created",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString());

   
    if (event.event === "payment.captured") {
      const entity = event.payload.payment.entity;

      const razorpayOrderId = entity.order_id;
      const razorpayPaymentId = entity.id;

      const payment = await Payment.findOne({
        transactionId: razorpayOrderId,
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      //  Retry protection
      if (payment.transactionId !== razorpayOrderId) {
        return res.status(200).json({ message: "Old transaction ignored" });
      }

      if (payment.status === "succeeded") {
        return res.status(200).json({ message: "Already processed" });
      }

      payment.status = "succeeded";
      payment.gatewayPaymentId = razorpayPaymentId;  // ← IMPORTANT
      payment.paymentMode = entity.method;

      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.orderStatus = "processing";
        await order.save();
      }
    }

 
    if (event.event === "refund.processed") {
      const refundEntity = event.payload.refund.entity;

      const paymentId = refundEntity.payment_id;

      const payment = await Payment.findOne({
        gatewayPaymentId: paymentId,
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      payment.status = "refunded";
      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.orderStatus = "cancelled";
        await order.save();
      }
    }

    
    if (event.event === "refund.failed") {
      const refundEntity = event.payload.refund.entity;
      const paymentId = refundEntity.payment_id;

      const payment = await Payment.findOne({
        gatewayPaymentId: paymentId,
      });

      if (payment) {
        payment.status = "succeeded"; // revert
        await payment.save();
      }
    }

    return res.status(200).json({ message: "Webhook processed" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.retryPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    //  Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        message: "Order cannot be retried at this stage",
      });
    }

    //  Find payment
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "succeeded") {
      return res.status(400).json({
        message: "Payment already completed",
      });
    }

    if (payment.retryCount >= 3) {
      return res.status(400).json({
        message: "Maximum payment attempts reached",
      });
    }

    //  Increment retry count
    payment.retryCount += 1;

    //  Create new Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    //  Update transactionId
    payment.transactionId = razorpayOrder.id;
    payment.status = "pending";

    await payment.save();

    //  Send new checkout data
    res.status(200).json({
      message: "Retry payment initiated",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      retryCount: payment.retryCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refundPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "succeeded") {
      return res.status(400).json({
        message: "Only successful payments can be refunded",
      });
    }

    if (payment.paymentGateway !== "razorpay") {
      return res.status(400).json({
        message: "Refund not supported for this gateway",
      });
    }

    if (!payment.gatewayPaymentId) {
      return res.status(400).json({
        message: "Gateway payment ID missing",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    //  find razorpay payment
    await razorpay.payments.refund(payment.gatewayPaymentId);

    //   Start DB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      payment.status = "refunded";
      await payment.save({ session });

      order.orderStatus = "cancelled";
      await order.save({ session });

      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Payment refunded and stock restored",
      });
    } catch (dbError) {
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        message: "Refund succeeded but DB update failed. Manual review needed.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: req.query.status,
      currency: req.query.currency,
      paymentGateway: req.query.paymentGateway,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("orderId", "totalAmount orderStatus");
    res.status(200).json({
      message: "All payments",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
