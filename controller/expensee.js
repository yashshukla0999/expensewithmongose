const Expense = require("../model/expense");
const User = require("../model/user");
const Download = require("../model/download");
const AWS = require("aws-sdk");
require("dotenv").config();


//ADD EXPENSE
exports.addExpense = async (req, res, next) => {
  const { category, amount, description } = req.body;
  const total = Number(req.user.amounts) + Number(amount);
  try {
    const user = await User.findById(req.user._id)
      //user.amounts = total;
      user.updateOne(user.amounts = total);
      user.save()
      .then(()=>console.log("AMOUNT UPDATED"))
    const expense = await Expense.create(
      {
        category,
        amount,
        description,
        userId : req.user._id
      });
     res.status(200).json(expense);
      } 
     catch (error) {
     console.log(error);
     }  
     };

//GET EXPENSE BY ID
exports.getExpenseByPk = async (req, res, next) => {
  try {
    const id = req.header("authorization");
    let result = await Expense.findById(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};


//EDIT EXPENSE
exports.editExpense = async (req, res, next) => {
  const ide = req.params.Nid;
  const category = req.body.category;
  const price = req.body.amount;
  const description = req.body.description;
  await Expense.findById(ide)
    .then((data) => {
      data.category = category;
      data.amount = price;
      data.description = description;
      return data.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};


//GET ALL EXPENSES
exports.getExpense = async (req, res, next) => {
  const page = req.query.page || 1;
  const lim = req.query.limit || 2;
  try {
    let result = await Expense.find({userId : req.user._id})
      .skip(Number(Number(page) - Number(1)) * Number(lim))
      .limit( Number(lim));
    const count = await Expense.find({UserId : req.user._id}).count();
    let prev;
    let nex;
    const curr = page;
    const hasPre = page > 1;
    if (hasPre) {
      prev = Number(page) - Number(1);
    }
    const hasNex = page * lim < count;
    if (hasNex) {
      nex = Number(page) + Number(1);
    }
    const pagination = {
      hasPre,
      hasNex,
      prev,
      nex,
      curr,
    };
    res.status(200).json({ data: result, pagination: pagination });
  } catch (err) {
    console.log(err);
  }
};


//DELETE EXPENSES
exports.deleteExpense = async (req, res, next) => {
  const idd = req.params.Nid;
   try {
    const exp = await Expense.findById(idd);
    const newamounts = Number(req.user.amounts) - Number(exp.amount);
    const user = await User.findById(req.user._id)
      user.amounts = newamounts;
      user.save();
    const deleted = await Expense.findByIdAndRemove(idd)
    console.log("deleted");
    console.log(deleted);
    res.status(200).send("deleted");
  } 
  catch (error) {
    console.log(err);
  }
};

//UPLOAD TO AWS S3
function uploadtoS3(data, filename) {
  const BUCKET_NAME = "expensedown";
  const IAM_USER_KEY = process.env.key;
  const IAM_USER_SECRET = process.env.secret;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    //Bucket:BUCKET_NAME
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((res, rej) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        rej(err);
      } else {
        res(s3response.Location);
      }
    });
  });
}

//DOWNLOAD FILE
exports.download = async (req, res, next) => {
  try {
    const expen = await Expense.find({userId : req.user._id});
    const expenJSON = JSON.stringify(expen);
    const date = new Date();
    const filename = `Expense${date}.txt`;
    const fileURL = await uploadtoS3(expenJSON, filename);
    Download.create({
      url: fileURL,
      userId: req.user._id
    });
    const downlist = await Download.find({userId : req.user._id});
    res.status(200).json({ fileURL, list: downlist, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, fileURL: "", err: error });
  }
};
