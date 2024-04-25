const mongoose = require("mongoose");

const courseSchema =  new mongoose.Schema(
    {
        title: {
          type: String,
          required: [true, 'Title is required'],
          minlength: [2, 'Title must be atleast 8 characters'],
          maxlength: [50, 'Title cannot be more than 50 characters'],
          trim: true,
        },
        price:{
          type:String,
          required:true
        },
        About:{
          type:String
        },
        ratings: {
          type: Number,
          default: 0,
        },
        reviews: [
          {
            user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
             url: {
                type: String,
              },
            rating: {
              type: Number,
              required: true,
            },
            comment: {
              type: String,
              required: true,
            },
          },
        ],
        description: {
          type: String,
          required: [true, 'Description is required'],
          minlength: [20, 'Description must be atleast 20 characters long'],
        },
        category: {
          type: String,
          required: [true, 'Category is required'],
        },
        lectures: [{
          question:[{
            user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
              // required: true,
            },
            name: {
              type: String,
              // required: true,
            },
            ques:{
              type:String,
            },
            reply:{
              type:String,
            },
            url: {
              type: String,
            },
            },
          ],
          notes:[{
            user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
            },
             title: {
              type: String,
            },
            description:{
              type:String,
            },
            },
          ],
            title: String,
            description: String,
            lecture: {
              public_id: {
                type: String,
              },
              secure_url: {
                type: String,
              },
            },
          },
        ],
        numlecture:{
           type:Number,
           default:0
        },
        thumbnail: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
        numOfReviews: {
          type: Number,
          default: 0,
        },
        numberOfLectures: {
          type: Number,
          default: 0,
        },
        createdBy: {
          type: String,
          required: [true, 'Course instructor name is required'],
        },
      },
      { timestamps: true }
)

module.exports = mongoose.model('course',courseSchema);