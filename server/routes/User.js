const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")
const resetPasswordController = require("../controllers/resetPassword")
const { auth } = require("../middlewares/auth")
router.post("/login",authController.login)
router.post("/signup", authController.signUp)
router.post("/sendotp", authController.sendOTP)
router.post("/changepassword", authController.changePassword)
router.post("/reset-password-token",resetPasswordController.resetPasswordToken )
router.post("/reset-password",resetPasswordController.resetPassword )

router.post("/logout",auth ,authController.logout)
// router.delete("/deleteProfile", authController.changePassword)


module.exports = router