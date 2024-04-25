const oldBook = require("../model/OldBooks");
const cloudinary = require("cloudinary").v2;
const sendEmail = require("../utils/sendEmail");
const emailValidator = require("email-validator");

cloudinary.config({
  cloud_name: "dc0qbtc4t",
  api_key: 528993286837345,
  api_secret: "C0bRoCjoxkLWC0UxPxlWLLBvRNM",
});

const createAd = async(req,res)=>{
 const {title,description,uname,city,num,priceType,price,itemCondition,author,mrp,edition,noOfPage,adDescription} = req.body;

const file = req.body.booksimage;
if(!file){
  return res.status(400).json({
    message:'Every field is required'
  })
}

 cloudinary.uploader.upload(file, async (err, result) => {
    console.log(result);
    try {
      const book = new oldBook({
        title: title,
        user:req.query.id,
        description: description,
        priceType: priceType,
        price:price,
        city:city,
        Name:uname,
        MobileNumber:num,
        ItemCondition:itemCondition,
        bookimage: {
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
       Author:author,
       Mrp:mrp,
       Edition:edition,
       NoPage:noOfPage,
       Addescription:adDescription,
      });
      await book.save();
      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
}

const getAd = async(req,res)=>{
  try {
    const perPage = 6;
    const { keyword } = req.query;
    const { page } = req.query || 1;

    if(keyword!=='' ){
      const old = await oldBook.find({
        $or: [{ title: { $regex: keyword, $options: "i" }}],
      })
        .skip((page - 1) * perPage)
        .limit(perPage);
        const booksCount = await oldBook.countDocuments();
        res.status(200).json({
          old,
          booksCount,
          perPage
        });
    }
    else{
      const old = await oldBook.find();
      res.status(200).json({
        old
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getSingleAd = async(req,res)=>{
   try {
    const book = await oldBook.findById(req.params.id);
    return res.status(200).json({
        success:true,
        book
    })
   } catch (error) {
    return res.status(500).json(error);
   }
}

const getByuser = async(req,res)=>{
  try {
    const book = await oldBook.find({user:req.params.id});
    return res.status(200).json({
        success:true,
        book
    })
   } catch (error) {
    return res.status(500).json(error);
   }
}

const getsimilar = async(req,res)=>{
  try {
    const book = await oldBook.find({_id:{$ne:req.query.id}});
    return res.status(200).json({
      success:true,
      book
  })
  } catch (error) {
    return res.status(500).json(error);
  }
}


const message = async(req,res)=>{
  const emailValid = emailValidator.validate(req.body.email);
  if (!emailValid) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email id",
    });
  }
  if(!req.body.message || !req.body.email || !req.body.subject) {
    return res.status(500).json({
        success: false,
      message: "All Field is required",
      })
  }
  const message = req.body.message;
  try {
   await sendEmail({
     em1:req.query.em1,
     email:req.body.email,
     subject: req.body.subject,
     message,
   })
   res.status(200).json({
     success: true,
     message: `Confirmation message sent to  `,
   });
  } catch (error) {
   return res.status(500).json({
     success: false,
     message: error.message,
   });
  }
 }

 const deleteAd = async(req,res)=>{
    try {
      const delBook = await oldBook.findByIdAndDelete(req.params.id);
      for (let i = 0; i <  delBook.bookimage.length; i++) {
        await cloudinary.uploader.destroy(delBook.bookimage[i].public_id);
      }
      return res.status(200).json("Ad has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
 }

module.exports = {createAd,getAd,getSingleAd,getByuser,getsimilar,message,deleteAd}