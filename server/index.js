require("dotenv").config()
const cookieParser = require("cookie-parser")
const {connectDB} = require("./config/database")
const express= require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const {cloudinaryConnect} = require("./config/cloudinary")
const authRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const courseRoutes = require("./routes/Course")
const contactRoutes = require("./routes/Contact")
const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
//routing

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
cloudinaryConnect()
connectDB()
app.get("/",(req,res)=>{
    res.send("Namaste")
})
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes);
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server started at port -> ",PORT)
})
