const express = require("express")
const router = express.Router()
const {auth} = require("../middlewares/auth")
const profileController = require("../controllers/Profile")
router.get("/getUserDetails",auth,profileController.getUserDetails)
router.put("/updateProfile",auth,profileController.updateProfile)
router.delete("/deleteProfile",auth,profileController.deleteAccount)
// router.get("/getEnrolledCourses", auth, profileController) 
router.put("/updateDisplayPicture", auth, profileController.updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard) 
module.exports = router