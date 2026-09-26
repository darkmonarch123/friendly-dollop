const express = require('express');
const prisma = require('./db');
const bcrypt = require('bcryptjs')
const app = express();
const port = 3030;
const router = express.Router()


//1. Register User
router.post('/register', async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password ){
        return res.status(400).json({message:"Email and Password are required"})
    }

    try{
        //2. Check if user already exists
        const existingUser = await prisma.user.findUnique({where:{email}});

        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        //.3 Hash the password using bcrypt
        const  hashedPassword = await bcrypt.hash(password, 10);

        //4. Create a new user in the database
        const newUser = await prisma.user.create({
            data:{
                email, password: hashedPassword
            }
        })
      //  5. Return a success response   
      return res.status(201).json({
        message:"User successfully Registered",
        user:{
            id : newUser.id,
              email : newUser.email,
              createdAt : newUser.createdAt
         }});

    }catch(error){
        console.error("Registration error", error)
        return res.status(500).json({message:"Failed to Register User, Internal server error during registration"})
    }
})

module.exports= router;