const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const forgotSchema = new Schema({
        _id:{
        type : String,
        required : true
        },
        isActive: {
        type: Boolean,
        default: false
         },
         userId: {
         type: Schema.Types.ObjectId,
         require: true,
         ref : 'User'
         }
})

module.exports=  mongoose.model('Forgot', forgotSchema)