const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course");
const Z = require("zod")
const { z } = require('zod');
const { default: mongoose } = require("mongoose");
const RatingandReview = require("../models/RatingandReview");

const createRatingSchema = z.object({
    courseId: z.string()
        .min(12, { message: "Course ID is required." }),
    rating: z.number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must be at most 5" }),
    review: z.string()
        .min(2, { message: "Review must be at least 2 characters long" })
});

const createRating = async (req,res) => {
    try {
        const userId = req.user.id
        const result = createRatingSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"All fields are required!",
                error:result.error.errors
            })
        }
        const{rating,review,courseId} = result.data
        // check if user enrolled for course or not 
        const courseDetails = await Course.findOne(
            {_id:courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId} },
        });
        if(!courseDetails){
            return res.status(401).json({
                success:false,
                message:"Course is not enrolled to student!"
            })
        }
        //check already reviewd course or not? 
         const isReviewExist = await RatingAndReview.findOne({
            user:userId,
            course:courseId
         })
         if(isReviewExist){
            return res.status(403).json({
                success:false,
                message:"Student already reviewed this course"
            })
         }
         const ratingAndReview = await RatingAndReview.create({
            user:userId,
            course:courseId,
            rating,
            review
         })
        //  update the created rating and review in the course data
        await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    ratingAndReviews:ratingAndReview
                }
            },{new:true}
        )
        return res.json({
            success:true,
            message:"Rating and review posted success!",
            data:ratingAndReview

        })
        } catch (error) {
        console.log("Error while creating rate and review-> ",error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
const getAverageRating = async (req,res) => {
    try {
        const {courseId} = req.body
        if( !courseId || courseId.length<18){
            return res.status(400).json({
                success:false,
                message:"Course Id is required."
            })
        }
    const result = await RatingAndReview.aggregate([
        {
            $match:{
                course:new mongoose.Types.ObjectId(courseId)
            }
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"rating"}
            }
        }
    ])
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating: result[0].averageRating,
        })
    }
    else{
        return res.json({
            success:true,
            message:'No rating found for this course.',
            averageRating:0,
        })
    }
    } catch (error) {
        console.log("Error getting average rating-> ",error)
        return res.status(500).json({
                success:false,
                message:"Internal server error"
        })
    }
}
const getAllRatingAndReview = async (req,res) => {
    try {
        const reviews = await RatingandReview.find({}).sort({
            rating:"desc"
        }).populate({
            path:"user",
            select:"firstName lastName email image"
        })
        .populate({
            path:"course",
            select:"courseName"
        })
        if(reviews.length<1){
            return res.json({
                success:true,
                message:"No reviews found."
            })
        }
        return res.json({
            success:true,
            message:"Reviews fetch success",
            data:reviews
        })
    } catch (error) {
        console.log("Error fetching the review -> ",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
    
}
module.exports={
    createRating,getAverageRating,getAllRatingAndReview
}