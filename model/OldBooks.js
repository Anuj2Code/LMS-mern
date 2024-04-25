const mongoose = require("mongoose");

const oldSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must be atleast 8 characters'],
        maxlength: [100, 'Title cannot be more than 50 characters'],
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be atleast 20 characters long'],
      },  
      priceType:{
        type: String,
        required: [true, 'price type is required'],
      },
      price:{
        type:Number,
        required:[true,'Price is required']
      },
      ItemCondition:{
        type:String,
        required:[true,'condition is required']
      },
      bookimage: {
        public_id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      Author:{
        type:String,
        required:[true,'Author is required']
      },
      Mrp:{
        type:Number,
        required:[true,'MRP is required']
      },
      Edition:{
        type:String,
        required:[true,'Edition is required']
      },
      NoPage:{
        type:Number,
        required:[true,'No Of pages is required']
      },
      Addescription:{
        type:String,
        required:[true,'Ad description is required'],
        minlength: [10, 'Ad description must be atleast 8 characters'],
        maxlength: [150, 'Ad description be more than 50 characters'],
      },
      Name:{
        type:String,
        required:[true,'Name is required']
      },
      MobileNumber:{
        type:Number,
        required:[true,'Mobile Number is required']
      },
      city:{
        type:String,
        required:[true,'City is required']
      }
},
{ timestamps: true }
)

module.exports = mongoose.model('oldBook',oldSchema);
