const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middilwares/auth");
const authorizeRoles = require("../middilwares/role");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: "Too many attempts, please try again after 15 minutes",
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
});
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
  message: {
    status: 429,
    message: "Too many attempts, please try again after 15 minutes",
},
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", registerLimiter, userController.register);
router.post("/login", loginLimiter, userController.login);
router.get("/users", auth, authorizeRoles("admin"), userController.getUsers);
router.get(
  "/users/me",
  auth,
  authorizeRoles("admin", "user"),
  userController.getMe,
);

module.exports = router;
