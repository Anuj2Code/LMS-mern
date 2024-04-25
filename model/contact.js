const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      Comment:{
        type: String,
        required: [true, "Message is required"],
      },
      Phone:{
        type:String,
        required: [true, "Phone number is required"],
      }
})

module.exports = mongoose.model("Contact",contactSchema);