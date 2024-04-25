const Order = require('../model/Order');

const CreateOrder = async(req,res)=>{
    const {
        orderCourse,
        paymentInfo,
        CoursePrice,
        totalPrice,
      } = req.body;
      const order = new Order({
        orderCourse,
        paymentInfo,
        CoursePrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.query.id,
      });
      const saved = await order.save();
      try {
        return res.status(200).json({
          data : saved,
        });
      } catch (error) {
        return res.status(500).json(error);
      }
}

const singleOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
      if (!order) {
        return res.status(400).json("Order not found with this id !");
      }
      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  const myOrder = async (req, res) => {
    try {
      const order = await Order.find({ user: req.query.id });
      const count =  await Order.find().countDocuments();
      if (!order) {
        return res.status(400).json("Order not found with this id !");
      }
      return res.status(200).json({
        success: true,
        data:order,
        count:count
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
  
  const getAllOrder = async (req, res) => {
    try {
      const order = await Order.find();
      const OrderCount = await Order.find().countDocuments();
      let totalAmount = 0;
  
      order.forEach((order) => {
        totalAmount += order.totalPrice;
      });
  
      return res.status(200).json({
        order,
        totalAmount,
        OrderCount
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
module.exports = {CreateOrder,singleOrder,getAllOrder,myOrder}