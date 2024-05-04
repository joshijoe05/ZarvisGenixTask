const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");


// register
router.post("/register", authController.handleRegister);
// login
router.post("/login", authController.handleLogin);
// get user data
router.get("/user", authController.handleGetUserData);

module.exports = router;