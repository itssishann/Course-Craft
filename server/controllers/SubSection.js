const SubSection = require("../models/subSection")
const Section = require("../models/Section")
const z = require("zod");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");
const subSectionSchema = z.object({
    title: z.string(2,"Title is required"),
    sectionId: z.string(2,"Section id is required"),
    timeDuration: z.string(2,"Duration is required."),
    description: z.string(2,"Description is required")
    // videoUrl: z.string().optional(), // Change to z.string().nonempty() if you want it to 
});
const createSubSection = async (req,res) => {
    try {
        const video = req.files.videoFile;
        const result = subSectionSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"All fields are required.",
                error:result.error.errors
            })
        }
        const {title,sectionId,timeDuration,description} = result.data
        const uploadDetails = uploadImagetoCloudinary(video,process.env.CLOUDINARY_FOLDER)
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl:uploadDetails.secure_url
        })
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true}).populate("subSection").exec()
        return res.json({
            success:true,
            message:"Sub Section created successfully.",
            data:updatedSection
        })

    } catch (error) {
        console.log("Error creating the Sub section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while creating the Sub section."
        })
    }
} 

const updateSubSection = async (req,res) => {
    try {
        
    } catch (error) {
        console.log("Error updating the sub section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while updating the Sub section."
        })
    }
}
const deleteSubSection = async (req,res) => {
    try {
        
    } catch (error) {
        console.log("Error deleting the sub section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while deleting the Sub section."
        })
    }
}
module.exports={
    createSubSection,deleteSubSection,updateSubSection
}