import express from 'express' ;
import User  from '../models/usermodel.js' ;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {authorize}  from '../middleware/authorization.js';
import Order from '../models/orderModel.js';
import product from '../models/productModel.js';
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

  console.log('Update order status endpoint hit', status);

  try {
    // Check if order exists
    const order = await Order.findById(orderId).populate('items.product' , 'stock name');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'shipped') {
      // Loop with `for...of` to allow early return
      for (const item of order.items) {
        if (item.quantity > item.product.stock.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for product ${item.product.name}` 
          });
        }

        // Deduct from stock
        item.product.stock.quantity -= item.quantity;
        item.product.stock.sold += item.quantity;
        await item.product.save();
        console.log('Updated stock for product', item.product.name);
      }
    }
    else if( status === 'received') {
      console.log('Marking order as received, restocking items');
      for (const item of order.items) {
        item.product.stock.quantity += item.quantity;
        await item.product.save();
      }
    }
    else if (status === 'cancelled') {
      for (const item of order.items) {
        item.product.stock.quantity += item.quantity;
        item.product.stock.sold -= item.quantity;
        await item.product.save();
      }
    }

    // Update order status
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

router.post('/place-stock-order' , authorize , async (req, res)=>{
  try {
    const { productId , quantity , price } = req.body ;
    console.log('placing stock order' , productId , quantity , price) ;
    
    // Create new order
    const order = new Order({
      user: req.user._id,
      items: {
        product: productId ,
        quantity: quantity ,
        price: price
      },
      totalPrice: 0, // Assuming stock orders don't have a price
      shippingDetails: {
        fullName: req.user.fullname || 'Admin',
        address: 'ebazar factory',
        city: 'lahore',
        postalCode: '54000',
        phone: '0000000000'
      }
    });

    await order.save();

    return res.status(200).json({
      message: 'Stock order placed successfully',
      order
    })
  } catch (err) {
    console.error('Error placing stock order:', err);
    res.status(500).json({ error: 'Failed to place stock order' });
  }
})

export default router ;