const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require('../models/user');

const checkAuth = require('../middleware/check-auth');
const userController = require("../controllers/user");



// delete route
router.delete("/:userId", checkAuth, userController.user_delete);


// update token
router.patch("/token/:userId", userController.update_token);


// get user by email
router.get("/", userController.getUserByEmail);

module.exports = router;