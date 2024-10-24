const Profile = require("../models/Profile")
const User = require("../models/User")
const z = require("zod")
const Course = require("../models/Course")
const {uploadImagetoCloudinary} = require("../utils/imageUploader")
const updateProfileZodSchema = z.object({
    dateOfBirth:z.string().default(""),
    gender:z.string().optional(),
    about:z.string().default(""),
    contactNumber:z.string().optional()
})
const updateProfile = async (req,res) => {
    try {
        const result = updateProfileZodSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"All Fields are required",
                error:result.error.errors
            })
        }
        const{dateOfBirth,gender,about,contactNumber} = result.data
        const userId = req.user.id
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails
        const profileData = await Profile.findById(profileId)
        profileData.dob = dateOfBirth
        profileData.about = about
        profileData.gender = gender
        profileData.contactNumber = contactNumber
        await profileData.save()
        return res.json({
            success:true,
            message:"Profile update success.",
            data:profileData
        })
        
    } catch (error) {
        console.log("Profile update error-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while updating the profile details."
        })
    }
}
const deleteAccount = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find user details
      const userDetails = await User.findById(userId);
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: "No profile with this IDs.",
        });
      }
  
      // Delete the user profile
      if (userDetails.additionalDetails) {
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
      }
  
      // Get courses the user is enrolled in
      const enrolledCourses = await Course.find({ enrolledStudents: userId });
  
      // Decrement the enrolled student count for each course
      await Promise.all(
        enrolledCourses.map(async (course) => {
          await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: -1 } });
        })
      );
  
      // Delete the user account
      await User.findByIdAndDelete(userId);
  
      return res.json({
        success: true,
        message: "Account deleted successfully.",
      });
  
    } catch (error) {
      console.log("Profile Delete error -> ", error);
      return res.status(500).json({
        success: false,
        message: "Problem while deleting the user account.",
      });
    }
  };
  
const getUserDetails = async (req,res) => {
    try {
        const {id} = req.user
        const userDetails = await User.findById(id).select("-password").populate("additionalDetails").exec()
        return res.json({
            success:true,
            message:"User Details fetched.",
            data:userDetails

        })

    } catch (error) {
        console.log("User Details fetching error ->",error)
        return res.status(500).json({
            success:false,
            message:"User Details can't found."
        })
    }
} 
const updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImagetoCloudinary(
        displayPicture,
        process.env.CLOUDINARY_FOLDER,
        1000,
        1000
      )
      
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.json({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
module.exports = {
    updateProfile,deleteAccount,getUserDetails,updateDisplayPicture
}