const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minLength: [5, "Name must be atleast of 5 chars"],
      maxLength: [50, "Name must not be more than 50 chars"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      unique: [true, "already register !"],
    },
    password: {
      type: String,
      required: [true, " pasword is required"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      `${process.env.Secret}`,
      { expiresIn: '24h' }
    );
  },
};
module.exports = mongoose.model("User", userSchema);