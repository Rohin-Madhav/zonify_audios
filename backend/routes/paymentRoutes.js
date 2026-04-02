const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");
const rateLimit = require("express-rate-limit");

const initializeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many payment initialization attempts.",
});

const retryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many retry attempts.",
});

router.post(
  "/initialize",
  auth,
  initializeLimiter,
  paymentController.initializeRazorpayPayment,
);
router.post("/webhook", paymentController.handleRazorpayWebhook);
router.post("/retry", auth, retryLimiter, paymentController.retryPayment);
router.post(
  "/refund/:paymentId",
  auth,
  authorizeRoles("admin"),
  paymentController.refundPayment,
);
router.get(
  "/all",
  auth,
  authorizeRoles("admin"),
  paymentController.getAllPayments,
);
router.get(
  "/:id",
  auth,
  authorizeRoles("admin"),
  paymentController.getPaymentById,
);

module.exports = router;
