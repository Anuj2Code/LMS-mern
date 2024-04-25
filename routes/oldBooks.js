const express = require('express');
const router  = express.Router();
const {createAd,getAd,getSingleAd,getByuser,getsimilar,message,deleteAd} = require("../controller/books")

router.post('/adOld',createAd);
router.get('/getAd',getAd);
router.get('/getoneAd/:id',getSingleAd);
router.get('/getbyUser/:id',getByuser)
router.get('/sim',getsimilar);
router.post('/mess',message)
router.delete('/del/:id',deleteAd)

module.exports = router