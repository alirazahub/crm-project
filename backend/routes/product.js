// routes/productRoutes.js
import express from 'express';
import Product from '../models/productmodel.js'; // Path to your product schema

const router = express.Router();

// --------Creates a new product and saves it to the database
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // Send back the created product with a 201 status
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            return res.status(400).json({ message: 'Validation Error', errors });
        }
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Server error occurred while saving the product.' });
    }
});

//-------- Fetches all products from the database.
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products); // Send back all products with a 200 status
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error occurred while fetching products.' });
    }
});

// You can add more routes here, e.g., for fetching a single product by ID, updating, or deleting.
// Example:
// router.get('/:id', async (req, res) => { ... });

export default router;