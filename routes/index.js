const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const authController = require("../controllers/auth_controller");
const userValidationRules = require("../validation/user");

router.use("/albums", auth.basic, require("./album"));
router.use("/photos", auth.basic, require("./photo"));

// Register a user
router.post(
	"/register",
	userValidationRules.createRules,
	authController.register
);

router.post("/login", auth.basic, authController.login);
module.exports = router;
