const Section = require("../models/Section")
const Course = require("../models/Course")
const z = require("zod")
const sectionSchema = z.object({
    sectionName: z.string().min(1, 'Section name is required'),
    courseId:z.string().min(1,`Course Id is required`)
}) 
const createSection = async (req,res) => {
    try {
        const result = sectionSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"All Fields are required!",
                error:result.error.errors
            })
        }
        const { sectionName, courseId } = result.data;
        const newSection = await Section.create({sectionName})
        const updateCourse = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }

        },{new:true}
        ).populate({
           path:"courseContent"
        }).exec()
        return res.json({
            success:true,
            message:"Course Section added!",
            data:updateCourse
        })
    } catch (error) {
        console.log("Error creating an section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while creating Section."
        })
    }
}
const updateSectionSchema = z.object({
    sectionName: z.string().min(1, 'Section name is required'),
    sectionId:z.string().min(1,`Section Id is required`)
}) 
const updateSection = async(req,res)=>{
    try {
        const result = updateSectionSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"All fields are required!",
                error:result.error.errors
            })
        }
        const {sectionName,sectionId} = result.data
        const section = await Section.findByIdAndUpdate(sectionId,{
            sectionName
        },{new:true})
        return res.json({
            success:true,
            message:"Section name chnaged successfully..",
            data:section
        })
    } catch (error) {
        console.log("Error updating an section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while updating the Section."
        })
    }
}
const deleteSection = async (req,res)=>{
    try {
            const {sectionId} = req.params;
            if(!sectionId){
                return res.status(400).json({
                    success:false,
                    message:"Section id is required!"
                })
            }        
            await Section.findByIdAndDelete(sectionId)
            return res.json({
                success:true,
                message:"Section deleted!"
            })
    } catch (error) {
        console.log("Error deleting the section-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while deleting the Section."
        })
    }
}
module.exports={
    createSection,updateSection,deleteSection
}