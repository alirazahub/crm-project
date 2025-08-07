import express from 'express' ;
import User  from '../models/usermodel.js' ;
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const router = express() ;

router.post('/', async (req , res)=>{
    const { email , password } = req.body ;
    console.log(email, password) ;
    const user = await User.findOne({email}) ;
    if(user)
    {
        console.log(user) ;
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch)
            res.status(200).json('login successful') ;
        else
            res.send({error : "passwords dont match"}) ;
    }
    else
    {
        console.log('sending error') ;
        res.send({error: "user not found"}) ;
    }
        
    
});

router.post('/google-sign-in', async(req,res)=>{
    const {name , email , image} = req.body ;
    let user = await  User.findOne({email}) ;
    console.log(user) ;
    if(!user){
        user = await User.insertOne({
            email , 
            fullname : name , 
            image
        });
        console.log(user) ;
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //user._id is stored in token for safety

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            email: user.email,
            name: user.name,
            image: user.image,
        },
    });

})

export default router ;