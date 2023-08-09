const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const razorSchema = new Schema({

                paymentid: {
                    type: String,
                      },
                orderId:{
                    type:String,
                    required: true
                },
                status: {
                    type:String,
                    required: true
                },
                userId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref : 'User'
                }
            })

module.exports = mongoose.model('Razor', razorSchema);