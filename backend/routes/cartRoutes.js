const router = require("express").Router();
const cartController = require("../controllers/cartController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");

router.post("/add", auth, authorizeRoles("user"), cartController.addCart);
router.get("/", auth, authorizeRoles("user", "admin"), cartController.getCart);
router.patch(
  "/update/:id",
  auth,
  authorizeRoles("user"),
  cartController.updateCart,
);
router.delete(
  "/remove/:id",
  auth,
  authorizeRoles("user"),
  cartController.removeCartItem,
);

module.exports = router;
