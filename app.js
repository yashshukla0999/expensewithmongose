const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const Razorpay = require('razorpay');
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const mongoose= require('mongoose');

const bodyParser = require('body-parser');
require ("dotenv").config();
 const userRoutes = require('./route/user');
 const expenseRoute = require('./route/expense');
 const razorRoute = require('./route/razor');
 const forgotRoute = require('./route/forgotrequest');
const app= express();

//morgan log file
const accessFile= fs.createWriteStream(path.join(__dirname, 'access.log'),{flag:'a'});

//middlewares
app.use(cors());
app.use(compression());
app.use(morgan('combined', {stream:accessFile}));
app.use(bodyParser.json());
app.use(express.static('public'));

 app.use('/user', userRoutes);
 app.use('/purchase',razorRoute);
 app.use('/user/login',expenseRoute);
 app.use('/called/password',forgotRoute);

app.use((req, res, next) => {
    if (req.url === '/') {
        return res.sendFile(path.join(__dirname, 'public', 'signup.html'))
    }
    res.sendFile(path.join(__dirname, `${req.url}`))
})

mongoose.connect('mongodb+srv://anshul:1234@cluster0.qvr9g2a.mongodb.net/Expenses?retryWrites=true&w=majority')
.then(()=>
{
    app.listen(3000);
    console.log("MONGODB CONNECTED");
})
.catch(err=>console.log(err));