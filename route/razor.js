const express = require("express");
const router = express.Router();

//CONTROLLERS
const userController = require("../controller/user");
const razorController = require("../controller/razor");

const middle = require("../midleware/auth");

//GET LEADERBOARD
router.get('/getCheat', razorController.getCheat);
//BUY PREMIUM
router.get('/premium', middle.authenticate, razorController.buypremium);
//UPDATE PAYMENT
router.post('/updatestatus', middle.authenticate, razorController.updatestatus);

module.exports = router;
