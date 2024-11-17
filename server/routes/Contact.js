const express = require("express")
const contactUsController  = require("../controllers/Contact")
const  {isAdmin, auth}  = require("../middlewares/auth")
const router = express.Router()
router.post("/contact",contactUsController.contactUs)
router.get("/contact-data",contactUsController.contactData)
module.exports=router