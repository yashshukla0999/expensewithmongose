const express = require("express");
const router = express.Router();

const resetpassword = require("../controller/forgotrequest");

//FORGOT PASSWORD
router.use("/forgotpassword", resetpassword.forgotpassword);
//RESET PASSWORD
router.use("/resetpassword/:uid", resetpassword.resetpassword);
//UPDATE PASSWORD
router.use("/updatepassword/:id", resetpassword.updatepassword);

module.exports = router;
