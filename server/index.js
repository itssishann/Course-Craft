require("dotenv").config()
const cookieParser = require("cookie-parser")
const {connectDB} = require("./config/database")
const express= require("express")
const app = express()
app.use(cookieParser())
connectDB()
const PORT = process.env.PORT
app.listen((PORT)=>{
    console.log("Server started at port -> ",PORT)
})
