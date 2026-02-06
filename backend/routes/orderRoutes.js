const router = require("express").Router();
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");
const orderController = require("../controllers/orderController");

router.post(
  "/create",
  auth,
  authorizeRoles("user"),
  orderController.createOrder,
);
router.get("/", auth, authorizeRoles("admin"), orderController.getAllOrders);
router.get("/my", auth, authorizeRoles("user"), orderController.getMyOrders);
router.get(
  "/my/:id",
  auth,
  authorizeRoles("user"),
  orderController.getOrdersById,
);
router.patch(
  "/update",
  auth,
  authorizeRoles("admin"),
  orderController.updateOrders,
);
router.delete(
  "/cancel/:id",
  auth,
  authorizeRoles("user"),
  orderController.cancelOrders,
);

module.exports = router;
