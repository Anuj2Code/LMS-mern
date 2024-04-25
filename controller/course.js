const Course = require("../model/course");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dc0qbtc4t",
  api_key: 528993286837345,
  api_secret: "C0bRoCjoxkLWC0UxPxlWLLBvRNM",
});

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  const file = req.files.thumbnail; // important for uploading lecture
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    console.log(result);
    try {
      const course = new Course({
        title: title,
        description: description,
        category: category,
        createdBy: createdBy,
        thumbnail: {
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
      });
      await course.save();
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};

const getAllCourse = async (req, res) => {
  try {
    const perPage = 6
       const { keyword, category } = req.query;
       console.log(category);
       const { page } = req.query || 1;

       if(category==='' && keyword!=='' ){
         const prod = await Course.find({
           $or: [{ title: { $regex: keyword, $options: "i" }}],
         })
           .skip((page - 1) * perPage)
           .limit(perPage);
           console.log(prod,'gdi');
           const productsCount = await Course.countDocuments();
           res.status(200).json({
             prod,
             productsCount,
             perPage
           });
       }
       else if(category!=='' && keyword===''){
         const prod = await Course.find({
           $or: [{
             category: {
               $regex: category,
               $options: "i",
             },
           }],
         })
           .skip((page - 1) * perPage)
           .limit(perPage);
           const productsCount = await Course.countDocuments();
           res.status(200).json({
             prod,
             productsCount,
             perPage,
           });
       }
       else{
         const prod = await Course.find({
           $or: [{ title: { $regex: keyword, $options: "i" } },{category:{ $regex: category, $options: "i" }}],
         })
           .skip((page - 1) * perPage)
           .limit(perPage);
           const productsCount = await Course.countDocuments();
           res.status(200).json({
             prod,
             productsCount,
             perPage,
           });
       }
     } 
   catch (error) {
    return res.status(500).json(error);
   }
};

const addLecture = async(req,res)=>{
  const course = await Course.findById(req.params.id);
  if(!req.body.title || !req.body.description){
    return res.status(400).json({
      success:false,
      message:'Title and Description is required'
    })
  }
  let lectureData = {};

  const file = req.files.lectures; // important for uploading lecture
  cloudinary.uploader.upload(file.tempFilePath, {
    resource_type:'video',
    folder:'products'
  },async (err, result) => {
    console.log(result);
    try {
      lectureData.public_id = result.public_id;
      lectureData.secure_url = result.secure_url;
      console.log(lectureData);

       course.lectures.push({
        title:req.body.title,
        description:req.body.description,
        lecture:lectureData
       })
  
       course.numberOfLectures = course.lectures.length;
       await course.save();
  
       res.status(200).json({
         success: true,
         course,
       });
    } catch (error) {
      return res.status(500).json(error);
    }
  });
}
const getSingle = async(req,res)=>{
  try {
    const course = await Course.findById(req.params.id);
     res.status(200).json(course)
  } catch (error) {
    return res.status(500).json(error);
  }
}
const createReviewAll = async (req, res) => {
  try {
    const { comment, rating, CourseID, url } = req.body;
    let review={}
    console.log(url);
    if(url!=''){
       review = {
        user: req.query.id,
        name: req.query.username,
        rating: Number(rating),
        comment: comment,
        url:url
      };
    }else{
       review = { 
        user: req.query.id,
        name: req.query.username,
        rating: Number(rating),
        comment: comment,
      };
    }
    console.log(review);
    const course = await Course.findById(CourseID);

    const isReviewed = course.reviews.find(
      (rev) => rev.user.toString() === req.query.id.toString()
    );
    console.log(isReviewed);

    if (isReviewed) {
      course.reviews.forEach((rev) => {
        if (rev.user.toString() === req.query.id) {
          rev.rating = rating;
          rev.comment = comment;
          rev.url=url
        }
      });
    } else {
       course.reviews.push(review);
      console.log(course.reviews);
      course.numOfReviews = course.reviews.length;
    }
    let avg = 0;
    course.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    console.log(avg);
    course.ratings = avg / course.reviews.length;

    await course.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
const createReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const review = {
      user: req.query.id1,
      name: req.query.username,
      rating: Number(rating),
      comment: comment,
    };
    console.log(review);
    const course = await Course.findById(req.query.id);
    let reviewed = {};
    course.lectures.forEach((rev)=>{
      rev.reviews.forEach((io)=>{
           if(io.user.toString()===req.query.id){
                 reviewed=io
           }
      })
    })
   console.log(reviewed,'yh');
    if (reviewed) {
      course.lectures.forEach((rev) => {
        rev.reviews.forEach((ip)=>{
          if (ip.user === req.query.id1) {
            ip.rating = rating;
            ip.comment = comment;
          }
        })
      });
    } else {
      course.lectures.forEach((rev) => {
        rev.reviews.push(review)
      })
    }
    await course.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const createNotes= async(req,res)=>{
  try {
    const courseLec = await Course.findById(req.query.id);
  const {title,description} = req.body;
  const obj ={
    title:title,
    description:description,
    user:req.query.id1
  }
 
  let check = false;

 courseLec.lectures.forEach((rev)=>{
   rev.notes.find((ip)=>{
    if(ip.user.toString()===req.query.id1.toString()){
     check= true
    }
  })
  })

  console.log(check,'check');
   if(check===true){
    courseLec.lectures.forEach((rev)=>{
      rev.notes.forEach((ip)=>{
          if(ip.user.toString()===req.query.id1.toString() && ip._id.toString()===req.query.id3){
              ip.title=title,
              ip.description=description
          }
      })
    })
   }
   if(req.query.id3==="" && title!=="" && description!==""){
    courseLec.lectures.forEach((rev)=>{
      if(rev._id.toString()===req.query.id2.toString()){
        rev.notes.push(obj);
      }
    })
   }
   await courseLec.save({ validateBeforeSave: false });
   return res.status(200).json({
    success: true,
    courseLec
  });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

const deleteNotes =async(req,res)=>{
  try {
    const courseLec = await Course.findById(req.query.id);
    if(!courseLec){
      return res.status(500).json({
        message:"Course Not Found"
      })
    }

    var reviews = []
    courseLec.lectures.forEach((rev)=>{
            rev.notes.forEach((re)=>{
             if(re.user.toString()!==req.query.id1 && re._id.toString()!==req.query.id3){ 
                reviews.push(re)
              }
           })  
   })
   courseLec.lectures.forEach((rev)=>{
      if(rev._id.toString()===req.query.id2){  
       rev.notes = reviews
      }
   })
   await courseLec.save({ validateBeforeSave: false })
   return res.status(200).json({
     success:true,
     courseLec
   });
    
  } catch (error) {
    console.log(error);
  }
}

const QnA = async(req,res)=>{
try {
  const courseLec = await Course.findById(req.query.id); // id hai lecture ki id
  const {ques,reply} = req.body;
  if(ques && !reply){
    const obj = {
      name: req.query.username,
      ques:ques,
      url:req.query.url,
      user:req.query.id1
    }
    courseLec.lectures.forEach((rev)=>{
      if(rev._id.toString()===req.query.id2){
        rev.question.push(obj);
      }
    })
  }

  if(reply){
    courseLec.lectures.forEach((rev)=>{
      rev.question.forEach((ip)=>{
        if(ip._id.toString()=== req.query.id5.toString()){
          ip.reply=reply;
       }
      })
    });
  }

 await courseLec.save()
  return res.status(200).json({
    success:true,
    data:courseLec
  })
} catch (error) {
  console.log(error);
    return res.status(400).json(error);
}
}

const deleteQna = async(req,res)=>{
  try {
    const course = await Course.findById(req.query.Courseid);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found !",
      });
    }
    console.log(course);    
    var reviews = []
     course.lectures.forEach((rev)=>{
             rev.question.forEach((re)=>{
              if(re.user.toString()!==req.query.id){  // id2 hai lecture ki id 
                 reviews.push(re)
               }
            })  // id hai user ki id
    })
    course.lectures.forEach((rev)=>{
       if(rev._id.toString()===req.query.id2){  // id2 hai lecture ki id 
        rev.question = reviews
       }
    })
    await course.save({ validateBeforeSave: false })
    return res.status(200).json({
      success:true,
      course
    });
  } catch (error) {
    
   }
}
const deleteReview = async(req, res) => {
  try {
    const course = await Course.findById(req.query.Courseid);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found !",
      });
    }
    console.log(course);
    var reviews = []
     course.lectures.forEach((rev)=>{
            reviews = rev.reviews.filter((word) => word._id.toString() !== req.query.id);  // id hai review ki _id
    })

    course.lectures.forEach((rev)=>{
       if(rev._id.toString()===req.query.id2){  //  id2 hai lecture ki _id
        rev.reviews = reviews
       }
    })
    await course.save({ validateBeforeSave: false })
    return res.status(200).json({
      success:true,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};


module.exports = {createReviewAll, deleteNotes,createNotes,createCourse, getAllCourse ,deleteQna,addLecture,getSingle,deleteReview ,QnA ,createReview};
