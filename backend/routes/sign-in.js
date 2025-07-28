import express from 'express' ;
import User  from '../models/usermodel.js' ;
import bcrypt from 'bcrypt' ;

const router = express() ;

router.post('/sign-in', async (req , res)=>{
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

export default router ;