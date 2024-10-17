const mongoose = require("mongoose")
const subSectionSchema = new mongoose.Schema({
    title:{
        type:String
    },
    timeDuration:{
        type:String
    },
    description:{
        type:String
    },
    videoUrl:{
        type:String,
        // required:true
    },
    additionalUrl:{
        type:String,
        default:"not-specified"
    }
})
module.exports =  mongoose.model("SubSection",subSectionSchema)