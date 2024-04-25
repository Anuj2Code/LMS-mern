const JWT = require("jsonwebtoken");
const User = require('../model/auth')

const JWTauth = async (req, res, next) => {
  const token = (req.cookies && req.cookies.token) || null;
  if (!token){
    return res.status(400).json({
      success: false,
      message: "Not authorised !",
    });
  }
  try {
    const payLoad = JWT.verify(token, `${process.env.Secret}`);
    req.user = await User.findById(payLoad.id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"Not authorised "
      })
  }
  next();
};

module.exports = {JWTauth}