const Contact = require('../model/contact');
const emailValidator = require("email-validator");

const createContact =async(req,res)=>{
 try {
  const emailValid = emailValidator.validate(req.body.email);
  if (!emailValid) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email id",
    });
  }
 
    const {email,username,comment,Phone} = req.body;
    if(Phone.length!==10) {
      return res.status(400).json({
        message:'Phone number must be of 10 digits long'
    })
    }
    if(!email || !username || !comment || !Phone){
      return res.status(400).json({
          message:'Every field is required'
      })
    }
    const con = new Contact({
      username:username,
      email:email,
      Comment:comment,
      Phone:Phone,
    })
    await con.save();
    return res.status(200).json({
        success:true,
        con
    })
 } catch (error) {
    res.status(400).json(error);
    console.log(error);
 }
}


module.exports = {createContact};