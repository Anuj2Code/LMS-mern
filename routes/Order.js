const express = require('express');
const router  = express.Router();
const {CreateOrder,getAllOrder,singleOrder,myOrder} = require('../controller/Order')

router.post('/createOrder',CreateOrder);
router.get('/singleOrder/:id',singleOrder)
router.get('/myOrder',myOrder)
router.get('/getAllOrder',getAllOrder)

module.exports = router