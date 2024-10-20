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
const categoryPageDetails = async (req,res) => {
    try {
        const { categoryId } = req.body
        if(!categoryId || categoryId.length < 18 ){
            return res.status(400).json({
                success:false,
                message:"Category id is required!"
            })
        }
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "Course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      if (!selectedCategory) {
        console.log("Category not found.")
        return res.json({ success: false, message: "Category not found" })
      }
      // no courses found fpr the id return the response no course
      if (selectedCategory.Course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories ..
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "Course",
          match: { status: "Published" },
        })
        .exec()
      const allCategories = await Category.find()
        .populate({
          path: "Course",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.Course)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
      res.json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
module.exports={
    getAllCategory,createCategory,categoryPageDetails
}