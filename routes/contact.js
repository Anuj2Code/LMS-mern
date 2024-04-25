const express = require('express');
const router  = express.Router();
const {createContact} = require('../controller/contact')
router.post('/new',createContact)

module.exports = router