const mongoose = require("mongoose")
const courseProgressSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    }]
})
module.exports = new mongoose.model("CourseProgress",courseProgressSchema)