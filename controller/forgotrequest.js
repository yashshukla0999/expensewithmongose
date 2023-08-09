const uuid = require("uuid");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const Forgot = require("../model/forgotrequest");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();


//FORGOT PASSWORD SENDGRID
exports.forgotpassword = async (req, res, next) => {
  const user = await User.findOne({email: req.body.email });
  if (user == null) {
    throw new Error("user not found");
  }
  const id = uuid.v4();
  
  Forgot.create({ _id : id, isActive: true, userId: user._id })
  .then(request=> console.log(request))
  .catch((err) => {
    throw new Error("not valid");
  });
  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.API_KEY;

  const transEmail = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "utubepretwo@gmail.com",
    name: "deadpool",
  };

  const receiver = [
    {
      email: `${req.body.email}`,
    },
  ];
  try {
    const result = await transEmail.sendTransacEmail({
      sender,
      to: receiver,
      subject: "Reset Password",
      htmlContent: `<p>Reset your password <a href="http://localhost:3000/called/password/resetpassword/${id}">Click here</a></p>`,
    });
    res
      .status(201)
      .json({
        message: "Link to reset password sent to your mail ",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};


//RSET PASSWORD SENDGRID
exports.resetpassword = async (req, res, next) => {
  try {
    const id = req.params.uid;
    const UID = await Forgot.findOne({ _id: id });
    if (UID) {
      if (UID.isActive) {
        UID.isActive = false ;
        UID.save();
        res.status(200).send(`<html>
              <title>reset password</title>
              <body>
                  <form action="/called/password/updatepassword/${id}" method="GET">
                  <input type="password" name="pass" required>
                  <label for="pass">New Password</label>
                 <input type="submit" value="Reset Password">
              </form>
              </body>
              </html>`);
      } else {
        throw new Error("isActive is false");
      }
    } else {
      throw new Error("uuid does not match");
    }
  } catch (error) {
    console.log(error);
  }
};


//UPDATE PASSWORD
exports.updatepassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pass = req.query.pass;
    const uid = await Forgot.findOne({_id: id });
    const saltrounds = 10;
    bcrypt.hash(pass, saltrounds, (err, result) => {
      console.log(result);
      if (err) {
        throw new Error("cannot bcrypt & sign");
      }
      User.updateOne({_id: uid.userId } , { password: result })
        .then(() =>
          res.status(201).json({ message: "Successfuly updated the new password" })
        )
        .catch((err) => console.log(error));
    });
  } catch (error) {
    console.log(error);
  }
};
