const express = require('express');
const router  = express.Router()
const {register,AllUser,getAllUser,login,getUserDetails,updatePassword,forgetPassword,ResetPassword,updateProfile} = require('../controller/auth')
const {JWTauth}  =  require('../middleware/JWTauth')

router.post('/register',register);
router.get('/allUser',getAllUser)
router.post('/login',login);
router.get('/getuser/:id',getUserDetails);
router.put('/update/:id',updatePassword);
router.post('/password/forgot',forgetPassword);
router.put('/updateProfile/:id',updateProfile);
router.put('/password/reset',ResetPassword);
router.get('/all',AllUser)

module.exports = router