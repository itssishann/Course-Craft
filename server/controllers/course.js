const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");
const z = require("zod");
const Category = require("../models/Category");

// Create course schema
const courseSchema = z.object({
    name: z.string().min(2, { message: "Name field is required and must be at least 2 characters." }),
    courseDescription: z.string().min(10, { message: "Course description is required and must be at least 10 characters." }),
    whatYouWillLearn: z.string().min(10, { message: "What you will learn is required and must be at least 10 characters." }),
    category: z.string(),
    price: z.string().regex(/^(?!0)[0-9]+(\.[0-9]{1,2})?$/, { message: "Price must be a valid positive number." })
        .transform((val) => parseFloat(val)) // Transform to float
        .refine((val) => val <= 99999, { message: "Price cannot exceed 99999." })
});

const createCourse = async (req, res) => {
    try {
        const thumbnail = req.files.thumbnailImage;
        const result = courseSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error.errors,
            });
        }

        const { name, courseDescription, whatYouWillLearn, category, price, tags } = result.data; // Destructure validated data
        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(401).json({
                success: false,
                message: "Instructor details not found.",
            });
        }

        // Ensure category is a valid ObjectId
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(401).json({
                success: false,
                message: "Category detail not found.",
            });
        }

        const uploadedThumbnailImage = await uploadImagetoCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER);
        
        // Create new course
        // const intPrice = parseFloat(price); // Ensure price is a float
        const newCourse = await Course.create({
            courseName: name,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category, // Add the category here
            thumbnail: uploadedThumbnailImage.secure_url,
            tag: tags || [] // Optional tags, defaults to empty array if not provided
        });

        // Add the course to the instructor's course array
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Course Created Successfully!",
            data: newCourse // Return the newly created course
        });
        
    } catch (error) {
        console.log("Error while creating a course -> ", error);
        return res.status(500).json({
            success: false,
            message: "Problem while creating the course!",
            errorData: error,
        });
    }
};


// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Course data fetched successfully.",
            data: courses,
        });
    } catch (error) {
        console.log("Error while getting the courses -> ", error);
        return res.status(500).json({
            success: false,
            message: "Problem while getting the courses.",
        });
    }
};

// Get course details
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId || courseId.length < 18) {
            return res.json({
                success: false,
                message: "Course ID is not valid.",
            });
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
        .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with this ID: ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully.",
            data: courseDetails,
        });
        
    } catch (error) {
        console.log(`Error while getting course details -> `, error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseDetails,
};
