require("dotenv").config()
const connectDB = require("./connect");
const movies = require("../models/movieModel")
const movieData = require("../jsonData/movieData.json")
const userModel = require("../models/userModel");
const userData = require("../jsonData/userData.json")
connectDB(process.env.mongo_pass)


const uploadDataToMongo = async()=>{
    try {
   connectDB(process.env.mongo_pass)
   await movies.deleteMany()
   await userModel.deleteMany();
   await movies.create(movieData)
   await userModel.create(userData)
   console.log("saveData")
 

        
    } catch (error) {
        console.log(error)
    }
} 
uploadDataToMongo()
