const Profile = require("../models/Profile")
const User = require("../models/User")
const z = require("zod")
const Course = require("../models/Course")
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
const deleteAccount = async (req,res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findById(userId)
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"No Profile with this id."
            })
        }
        //dele the user profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //delete user
        await Profile.findByIdAndDelete(userId)
        return res.json({
            success:true,
            message:"Account deleted successfully."
        })
        //delete the user count from enrolled course count also


    } catch (error) {
        console.log("Profile Delete error-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while deleting the user account ."
        })
    }
}
const getUserDetails = async (req,res) => {
    try {
        const {id} = req.user
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
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
module.exports = {
    updateProfile,deleteAccount,getUserDetails
}