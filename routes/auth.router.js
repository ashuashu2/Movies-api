require("dotenv").config()
const express = require("express");
const authRouter = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const authVerify = require("../middlewares/auth.middleware")



 const users = [
      {username:"ashutosh@1", password:"ashuashu"},
      {username:"abhishek@1", password:"abhiabhi"}  
      ]



 async function signupHandler(newUserDetails) {
  const emailOfUser = newUserDetails.email;
  console.log(emailOfUser )
  const password = newUserDetails.password
  console.log(password )


        const token  = jwt.sign({userId : emailOfUser},process.env.SECREAT,{expiresIn:"1h"})
  console.log(token )

       const  userExits =  await userModel.findOne({email :emailOfUser});
        console.log(userExits)
     
        if(userExits){
        console.log("the email is already exits in databse")
       }else{
         const salt  = await bcrypt.genSalt(10);
         const hashedPassword =  await bcrypt.hash(password, salt)

         const newUser = {
          email: newUserDetails.email ,
          password: hashedPassword,
          profilePictureUrl: newUserDetails.profilePictureUrl,
          username: newUserDetails.username ,
          nickname: newUserDetails.nickname ,
        phoneNo: newUserDetails.phoneNo
      }
         
      const updateUser  = new userModel(newUser );
      const saveUser = await updateUser.save()
      console.log("save")
     


      return { saveUser,token }

      }
    }
 
      

 authRouter.post("/signup",async(req,res)=>{

  const newUserDetail = req.body;
  try {
    const {saveUser , token} =  await signupHandler(newUserDetail)
    res.status(201).json({success:"new user created", saveUser,token})
  } catch (error) {
    
    res.json("user already exists")
  }





     }
     
    )







    async function loginHandler(email,password){

      const user = await userModel.findOne({email : email } );
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
      const {email , password} = req.body;
    
      if(decodeId  === email ){

        const  user  = await loginHandler(email,password)
         res.status(201).json({msg:"detail",userDetaild:user })
      }else{
        res.status(401).json({msg:"error comes" })
    
      }


      console.log(users)
    
    })








  






module.exports = authRouter