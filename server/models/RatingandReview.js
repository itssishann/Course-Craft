const mongoose = require("mongoose")
const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
        trim:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        trim:true,
        required:true
    },
    course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	}
})
module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema)