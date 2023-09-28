require("dotenv").config()
const express = require("express");
const authRouter = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const authVerify = require("../middlewares/auth.middleware")



 const users = [
      {username:"ashutosh@1", password:"ashuashu"},
      {username:"abhishek@1", password:"abhiabhi"}  
      ]



 async function signupHandler(username,password) {

        const token  = jwt.sign({userId : username},process.env.SECREAT,{expiresIn:"1h"})
        userExits = users.some((user)=>user.username === username);
     
        if(userExits){
        console.log("the userName is already exits in databse")
       }else{
         const salt  = await bcrypt.genSalt(10);
         const hashedPassword =  await bcrypt.hash(password, salt)
         const newUser = {
           username:username,
           password:hashedPassword
         }
         
         users.push(newUser)
         console.log(newUser)
         return { newUser,token }

      }
    }
      

 authRouter.post("/signup",async(req,res)=>{

  const {username ,password} = req.body;
  const {newUser,token} =  await signupHandler(username,password)
  res.status(201).json({success:"new user created", newUser,token})




     }
     
    )







    async function loginHandler(username,password){

      const user = users.find((us)=>us.username === username );
      if (user) {
        const comparePassword = await bcrypt.compare(password,user.password)
            if(comparePassword ){
              
              return user
        
            }else{
              res.json({error:"please check the password again"})
            }
        
      }

    }









    authRouter.post("/login",authVerify,async(req,res)=>{
      const {decodeId} = req.user;
      const {username , password} = req.body;
      console.log(decodeId )
      console.log(username )

      if(decodeId  === username ){

        const  user  = await loginHandler(username,password)
         res.status(201).json({msg:"detail",userDetaild:user })
      }else{
        res.status(401).json({msg:"error comes" })
    
      }


      console.log(users)
    
    })








  






module.exports = authRouter