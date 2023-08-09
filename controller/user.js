const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//SIGNUP
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email: email } );
  if (exist) {
    console.log("USER ALREADY EXIST");
    return res.status(403).json("User already exist!!");
  }
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    User.create({
      name: name,
      email: email,
      password: hash,
    })
      .then((user) => 
      {
      console.log(user);
      res.status(201).json("Sign up successful!!")
      })
      .catch((err) => console.log(err));
  });
};

//function for creating token
function generateToken(id, name, isPremium) {
  return jwt.sign({ userId: id, name: name, isPremium: isPremium }, "yashShukla");
}

//LOGIN
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try{
  const exist = await User.findOne({ email: email })
     if (exist == null) {
         return res.status(404).json("User doesn't exist");
      }
      bcrypt.compare(password, exist.password, (err, result) => {
        if (result) {
            console.log(exist);
          return res.status(201).json({
            message: "Login success",
            token: generateToken(
              exist._id,
              exist.name,
              exist.isPremium
            ),
          });
        }
        return res.status(401).json("User not authorized");
      });
    }
    catch(err) 
    {
        console.log(err);
}
}
