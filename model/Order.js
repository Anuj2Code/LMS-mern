const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
      orderCourse: 
        {
          title: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          courseId: {
            type: mongoose.Schema.ObjectId,
            ref: "Course",
            required: true,
          },
        },
      
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      paymentInfo: {
        id: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
      },
      paidAt: {
        type: Date,
        required: true,
      },
      CoursePrice: {
        type: Number,
        required: true,
        default: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
}) 

module.exports = mongoose.model("Order",OrderSchema)