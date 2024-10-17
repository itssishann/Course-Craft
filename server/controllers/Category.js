const Category = require("../models/Category");
// create category 
const createCategory = async(req,res)=>{
    try {
        const {name,description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const categoryDetails = await Category.create({name,description})
        console.log(`Category created-> `,categoryDetails)
        return res.json({
            success:true,
            message:"Category Creation success!"
        })
    } catch (error) {
        console.log("Eror creating the category-> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while creating an category."
        })
    }
}

// getAllTags
const getAllCategory = async(req,res)=>{
    try {
        const allCategory = await Category.find({},{name:true,description:true})
        return res.json({
            success:true,
            message:"category Fetched Success!",
            category:allCategory
        })
    } catch (error) {
        console.log("Problem while getting the category data -> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while getting the category."
           
        })
    }
}
module.exports={
    getAllCategory,createCategory
}