const mongoose = require("mongoose")
const tagsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    Course:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course"
    }
})
module.exports = mongoose.model("Tags",tagsSchema)