import express from 'express' ;
import User  from '../models/usermodel.js' ;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {authorize}  from '../middleware/authorization.js';
import Order from '../models/orderModel.js';
dotenv.config();

const router = express.Router() ;

router.post('/create-user' , authorize , async (req, res)=>{
    try{
        const { email , password , role , fullname } = req.body ;
    const user = new User({
        email ,
        password , 
        role ,
        fullname
    })
    await user.save() ;
    return res.status(200).json({
        message: 'user created successfully'
    })
    }catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'User creation failed' });
  }
    
})

router.get('/track-roles', authorize ,  async (req, res)=>{
    try {
        console.log('fetching users') ;
    const allUsers = await User.find({ role: { $in: ['user', 'manager', 'sales'] } });

    // Group the users by role
    const grouped = {
      users: {
        count: allUsers.filter(u => u.role === 'user').length,
        data: allUsers.filter(u => u.role === 'user')
      },
      managers: {
        count: allUsers.filter(u => u.role === 'manager').length,
        data: allUsers.filter(u => u.role === 'manager')
      },
      sales: {
        count: allUsers.filter(u => u.role === 'sales').length,
        data: allUsers.filter(u => u.role === 'sales')
      }
    };

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
})

router.get('/get-pending-orders' ,authorize , async (req, res)=>{
  try {
    const orders = await Order.find({ status: 'pending' }).populate('items.product'); 
    res.status(200).json(orders); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pending orders.' });
  }
})

router.put('/update-order-status/:orderId', authorize, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status
    order.status = status || order.status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.get('/get-dispatched-orders' ,authorize , async (req, res)=>{
  try {
    const orders = await Order.find({ status: { $in: ['delivered', 'shipped'] } }).populate('items.product'); 
    res.status(200).json(orders); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pending orders.' });
  }
})

export default router ;