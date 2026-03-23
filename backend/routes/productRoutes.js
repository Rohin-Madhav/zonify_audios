const router = require("express").Router();
const productController = require("../controllers/productController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");
const upload = require("../middilwares/multer");

router.post(
  "/create",
  auth,
  authorizeRoles("admin"),
  upload.array("images", 5),
  productController.addProduct,
);
router.get("/", productController.getProduct);
router.get(
  "/:id",
  auth,
  authorizeRoles("admin", "user"),
  productController.getProductById,
);
router.patch(
  "/update/:id",
  auth,
  authorizeRoles("admin"),
  productController.updateProduct,
);
router.delete(
  "/delete/:id",
  auth,
  authorizeRoles("admin"),
  productController.deleteProduct,
);

module.exports = router;
