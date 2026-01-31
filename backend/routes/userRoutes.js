const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/users", auth, authorizeRoles("admin"), userController.getUsers);
router.get(
    "/users/:id",
    auth,
    authorizeRoles("admin", "user"),
    userController.getUsersById,
);

module.exports = router;
