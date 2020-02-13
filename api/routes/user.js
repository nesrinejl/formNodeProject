const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require('../models/user');

const checkAuth = require('../middleware/check-auth');
const userController = require("../controllers/user");

// signup route
router.post('/signup', userController.user_signup);

// login route
router.post('/login', userController.user_login);

// delete route
router.delete("/:userId", checkAuth, userController.user_delete);


// update token
router.patch("/token/:userId", userController.update_token);

module.exports = router;