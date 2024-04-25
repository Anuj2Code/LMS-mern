const express = require('express');
const router  = express.Router();
const {createReviewAll,createNotes,deleteNotes,createCourse,QnA,deleteQna,getAllCourse,deleteReview,addLecture,getSingle,createReview} = require('../controller/course')

router.post('/newCourse',createCourse);
router.get('/allCourse',getAllCourse);
router.post('/addLect/:id',addLecture);
router.get('/single/:id',getSingle);
router.post('/doubt',QnA);
router.post('/review',createReview);
router.delete('/del',deleteReview);
router.delete('/delQna',deleteQna);
router.post('/give',createReviewAll)
router.post('/notes',createNotes);
router.delete('/noteDel',deleteNotes);

module.exports = router