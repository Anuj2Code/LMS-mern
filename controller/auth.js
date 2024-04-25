const User = require("../model/auth");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: "dc0qbtc4t",
  api_key: 528993286837345, 
  api_secret: "C0bRoCjoxkLWC0UxPxlWLLBvRNM"
});

const register = async (req, res) => {
  const emailValid = emailValidator.validate(req.body.email);
  if (!emailValid) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email id",
    });
  }
 
  if(!req.body.avatar){
    return res.status(400).json({
      message:'Please Select a Profile pic'
    })
  }
  // const file = req.files.avatar use during register api testing 
  const file = req.body.avatar
  cloudinary.uploader.upload(file,async(err,result)=>{ // 1 paramter as file.tempFilePath
    try {
   if(req.body.password!==req.body.confirmPassword){
       return res.status(400).json({
            success:false,
            message:'Confirm password does not match with the password'
        })
   }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    if(!req.body.username || !req.body.password || !req.body.confirmPassword){
        return res.status(400).json({
            message: "Every Field is Required",
        })
    }
    if (req.body.username.length < 5) {
      return res.status(400).json({
        message: "Username must be of 5 character",
      });
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      avatar: {
        public_id: result.public_id,
        url: result.url,
      },
    });
      await newUser.save();
      const token  = newUser.jwtToken();
      const options = {
          expiresIn: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
        httpOnly: true,
      };
      console.log(token);
      res.cookie("token", token, options);
      res.status(200).json({
        data: newUser,
      });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Account already exist with provided email_id ",
      });
    }
    res.status(400).json(error);
    console.log(error);
  }
})
}


const login = async(req,res)=>{
    const email = req.body.email;
    if(!email || !req.body.password){
        return res.status(400).json({
            message: "Every Field is Required",
        })
    }
    try {
        const user = await User.findOne({email}).select("+password");
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({
              success: false,
              message: "Invalid credential !",
            });
          }
          const token  = user.jwtToken();
          const options = {
              expiresIn: new Date(
                  Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
            httpOnly: true,
          };
          console.log(token);
          res.cookie("token", token, options);
          res.status(200).json({
            success: true,
            data: user,
          });
    } catch (error) {
        res.status(400).json(error);
        console.log(error);
    }
}

const getUserDetails= async(req,res)=>{
    try {
     const user = await User.findById(req.params.id);
     return res.status(200).json({
        data:  user
     })
    } catch (error) {
     return res.status(400).json(error)
    }
 }

const updatePassword = async(req,res)=>{
 try {
    const user = await User.findById(req.params.id).select("+password");
    const matchPass = await bcrypt.compare(req.body.oldPassword, user.password);
    if(!matchPass){
      return res.status(200).json({
        success:false,
        message:"Old Password is wrong !"
      })
    }
    if(req.body.newpassword!==req.body.confirmPassword){
      return res.status(200).json({
        success:false,
        message:"password is not match with the confirm password !"
      })
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newpassword, salt);
    user.password = hash;
    await user.save();
    const token = user.jwtToken();
    const options = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("token", token, options);
    res.status(200).json({
      success: true,
      data: user,
    });
 } catch (error) {
    res.status(400).json(error);
    console.log(error);
 }
}

let Otp = 0;
const otpG = ()=>{
   return Math.floor(1000 + Math.random() *9000);
}
Otp = otpG();

const forgetPassword  = async(req,res)=>{
   try {
    const user = await User.findOne({email:req.body.email});
    if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not Found !",
        });
      }

      const message = `Your OTP  is : ${Otp}`; // \n is used to change the line
      sendEmail({
        email: req.body.email,
        subject: `OTP verification`,
        message,
      });

        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email}`
        });
    }
       catch (error) {
        res.status(400).json(error);
         console.log(error);
      } 
}
const getAllUser = async(req,res)=>{
 try {
  const user = await User.find();
  return res.status(200).json({
    data:user
  })
 } catch (error) {
  res.status(400).json(error);
  console.log(error);
 }
}
const ResetPassword = async(req,res)=>{
try {
  if(req.body.otp==Otp){
    const user = await User.findOne({email:req.body.email})
    if(req.body.password!==req.body.confirmPassword){
        return res.status(400).json({
             success:false,
             message:'Confirm password does not match with the password'
         })
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    user.password = hash;
    await user.save();
    const token = user.jwtToken();
    const options = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("token", token, options);
    res.status(200).json({
      success: true,
      data: user,
    });
  }
  else{
    res.status(400).json({
      success: false,
      message:'Invalid Otp ',
    });
  }
} catch (error) {
    res.status(400).json(error);
     console.log(error);
  } 
}

const updateProfile = async(req,res)=>{
  if(req.body.image!==" "){
    const user = await User.findById(req.params.id);
    console.log(user);
     cloudinary.uploader.destroy(req.query.img,(err,resul)=>{
      console.log(resul);
      console.log(req.body.avatar);
     });
  cloudinary.uploader.upload(req.body.image, async(err,result)=>{
    console.log(result,'ftfuf');
    const newObject= {
      email:req.body.email,
      username:req.body.username
     }
     const user = await User.findByIdAndUpdate(req.params.id,newObject,{new:true});
         user.avatar={
          public_id:result.public_id,
          url:result.url
         }
         
        await user.save();
         return res.status(200).json({
          success:true,
          data:user
         })
    });
  }
  else{
    try {
      const newObject= {
        email:req.body.email,
        username:req.body.username
       }
       const user = await User.findByIdAndUpdate(req.params.id,newObject,{new:true});
       return res.status(200).json({
        success:true,
        data:user
       })
     } catch (error) {
      return res.status(400).json(error)
     }
  }
}

const AllUser = async(req,res)=>{
  try {
    const userII= req.query.id;
   const user = await User.find({ _id: { $ne: userII } });
   return res.status(200).json({
     data:user
   })
  } catch (error) {
   res.status(400).json(error);
   console.log(error);
  }
 }
module.exports = {register, login, getUserDetails,getAllUser ,updatePassword,forgetPassword ,ResetPassword,updateProfile,AllUser};
