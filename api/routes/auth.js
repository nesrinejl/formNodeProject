const express = require("express");
const router = express.Router();



const authController = require("../controllers/auth");

// signup route
router.post('/signup', authController.signup);

// login route
router.post('/login', authController.login);

//verify token
router.get('token-verification', checkAuth, authController.verifyToken)