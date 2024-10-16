require("dotenv").config()
const {connectDB} = require("./config/database")
const express= require("express")
connectDB()
