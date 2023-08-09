const Razorpay = require("razorpay");
const User = require("../model/user");
const Razor = require("../model/razor");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken1(id, name, isPremium) {
  return jwt.sign({ userId: id, name: name, isPremium: isPremium }, "asifali");
}


//GET LEADERBOARD
exports.getCheat = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name amounts').sort({ amounts : -1});
     console.log(users);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};


//BUY PREMIUM
exports.buypremium = (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    rzp.orders.create({ amount: 2500, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      Razor.create({ orderId: order.id, status: "PENDING", userId: req.user._id})
        .then(() => {
          console.log("38");
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong", error: err });
  }
};


//PAYMENT STATUS UPDATE
exports.updatestatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const name = req.user.name;
    const { payment_id, order_id } = req.body;
    const order = Razor.findOne({ orderId: order_id });
   const promise1= await order.updateOne({}, {paymentid : payment_id, status: "SUCCESS" });
      
    const promise2 = req.user.updateOne(req.user.isPremium =true );
    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({success: true,message: "Transaction Successful",
        token: generateToken1(userId, name, true)});
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.status(404).json({ error: err, message: "Something went wrong" });
  }
};
