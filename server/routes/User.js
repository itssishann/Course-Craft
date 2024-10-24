const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")
const { auth } = require("../middlewares/auth")
router.post("/login",authController.login)
router.post("/signup", authController.signUp)
router.post("/sendotp", authController.sendOTP)
router.post("/changepassword", authController.changePassword)
router.post("/logout",auth ,authController.logout)
// router.delete("/deleteProfile", authController.changePassword)


module.exports = router