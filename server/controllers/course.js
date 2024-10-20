const Course = require("../models/Course")
const User = require("../models/User")
const {uploadImagetoCloudinary} = require("../utils/imageUploader")
const z = require("zod")
const Category = require("../models/Category")
//create course
const courseSchema = z.object({
    name: z.string().min(2, { message: "Name field is required and must be at least 2 characters." }),
    courseDescription: z.string().min(10, { message: "Course description is required and must be at least 10 characters." }),
    whatYouWillLearn: z.string().min(10, { message: "What you will learn is required and must be at least 10 characters." }),
    category: z.string(),
    price: z.number().positive().max(99999, { message: "Price must be a valid positive number and cannot exceed 99999." }) 
});
exports.createCourse = async(req,res)=>{
    try {
        
        const thumbnail = req.files.thumbnailImage
        const result = courseSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:result.error.errors
            })
        }
        const userId = req.user.id
        const instructorDetails = await User.findById(userId)
        console.log("Instructor Details -> ",instructorDetails)
        if(!instructorDetails){
            return res.status(401).json({
                success:false,
                message:"Instructor details not found."
            })
        }
        const categoryDetails = await Category.findById(category)
        if(!categoryDetails){
            return res.status(401).json({
                success:false,
                message:"Category detail not found."
            })
        }
        const uploadedThumbnailImage = uploadImagetoCloudinary(thumbnail,process.env.CLOUDINARY_FOLDER)
        // create new course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:uploadedThumbnailImage.secure_url
        })
        // add the course to an instructor course array 
        await User.findByIdAndUpdate({id:instructorDetails._id},{
            $push:{
                courses:newCourse._id
            }
        },
       {new:true}
    )
    return res.json({
     success:true,
     message:"Course Created Success!"
    })
        
    } catch (error) {
        console.log("Error while creating an course -> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while creating the course!",
            errorData:error
        })
    }
}

// get all courses
const getAllCourses = async (req,res)=>{
    try {
        const courses = await Course.find({},{courseName:true,
                                              price:true,
                                              thumbnail:true,
                                              instructor:true,
                                              ratingAndReviews:true,
                                              studentsEnrolled:true

                         }).populate("Instructor").exec()
                         return res.status(200).json({
                            success:true,
                            message:"Course Data fetched Successfully..",
                            data:courses
                         })
    } catch (error) {
        console.log("Error while getting the courses-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while getting the courses."
        })
    }
}
const getCourseDetails = async (req,res) => {
    try {
        const {courseId} = req.body
        if( !courseId || courseId.length < 18){
            return res.json({
                success:false,
                message:"Course Id is not valid"
            })
        }
        const courseDetails = await Course.findById(courseId).populate({
                    path: "instructor",
                    populate: {
                      path: "additionalDetails",
                    },
                  })
                  .populate("category")
                  .populate("ratingAndReviews")
                  .populate({
                    path: "courseContent",
                    populate: {
                      path: "subSection",
                      select: "-videoUrl",
                    },
                  })
                  .exec()
                  if (!courseDetails) {
                    return res.status(404).json({
                      success: false,
                      message: `Could not find course with this id: ${courseId}`,
                    })
                  }
       
    } catch (error) {
        console.log(`Error while getting course Details-> `,error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
    }
}