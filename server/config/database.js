const mongoose = require("mongoose")
const connectDB =()=>{ mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connected!")
})
.catch((err)=>{
    console.log("DB Connection failure! ",err)
    process.exit(1)
})}
module.exports ={
    connectDB
}