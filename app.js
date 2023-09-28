require("dotenv").config()
const express = require("express");
const app = express();
const PORT = 2100;
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth.router")
const userRouter = require("./routes/user.router");
const movieRouter = require("./routes/movies.router");
const routeNotFound = require("./middlewares/route.notFound.middleware")
const globalErrorHandler = require("./middlewares/global.error.middlerware")





app.get("/",(req,res)=>{
    res.json("i m live")
})

app.get("/ashu",(req,res)=>{
    res.json("i m ashu")
})

app.use(express.json())
connectDB(process.env.mongo_pass);
 app.use("/auth",authRouter)
 app.use("/user",userRouter)
 app.use("/movies",movieRouter)
 app.use(routeNotFound)
 app.use(globalErrorHandler)

const start = async()=>{
    try {
        app.listen(PORT,()=>{
        console.log("i m connected" + PORT)
    })
} catch (error) {
        console.log(error)
    }
}
start()