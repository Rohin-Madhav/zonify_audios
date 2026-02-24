const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");

router.post("/initialize", auth, paymentController.initializeRazorpayPayment);
router.post("/webhook", paymentController.handleRazorpayWebhook);
router.post("/retry", auth, paymentController.retryPayment);
router.post("/refund",auth,authorizeRoles("admin"),paymentController.refundPayment)
router.get("/all",auth,authorizeRoles("admin"),paymentController.getAllPayments)
router.get("/:id",auth,authorizeRoles("admin"),paymentController.getPaymentById)

module.exports = router;
