const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
const categoryController = require("../controllers/Category")
const ratingController = require("../controllers/RatingandReview")
const sectionController = require("../controllers/Section")
const subSectionController = require("../controllers/SubSection")


// ********************************************************************************************************
//                                      Course  routes (Only for instructor) for creating the course
// ********************************************************************************************************
//  Protected route  for Instructor use only

router.post("/createCourse", auth, isInstructor, courseController.createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, sectionController.createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, sectionController.updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, sectionController.deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, subSectionController.updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, subSectionController.deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, subSectionController.createSubSection)


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category Protected route  for Admin use only
router.post("/createCategory", auth, isAdmin,categoryController.createCategory)
router.get("/showAllCategories", categoryController.getAllCategory)
router.post("/getCategoryPageDetails", categoryController.categoryPageDetails)


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, ratingController.createRating)
router.get("/getAverageRating", ratingController.getAverageRating)
router.get("/getReviews", ratingController.getAllRatingAndReview)
module.exports = router