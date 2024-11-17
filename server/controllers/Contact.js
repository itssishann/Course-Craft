const { contactUsEmail} = require("../mail/templates/contactUsEmail.js")
const mailSender = require("../utils/mailSender")
const z = require("zod")
const Contact = require("../models/Contact")
const contactSchema = z.object({
    firstname: z
    .string()
    .min(1, { message: "First Name is required" })
    .trim()
    .max(50, { message: "must be 50 characters or less" }),
    lastname: z
      .string()
      .min(1, { message: "Last Name is required" })
      .trim()
      .max(50, { message: "must be 50 characters or less" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim(),
    phoneNo: z
      .string()
      .optional(),
    countrycode: z
      .string({ message: "Invalid country code" }),
    message: z
      .string()
      .min(1, { message: "Message is required" })
      .trim()
      .max(400, { message: "Message must be 400 characters or less" }),
  });
const contactUs = async (req, res) => {
 
 
  // console.log(req.body)
  const result = contactSchema.safeParse(req.body)
  if(!result.success){
      return res.status(400).json({
          success:false,
          message:result.error.errors
      })
    }
  try {
    const {firstname,lastname,message,phoneNo,countrycode,email} = result.data
    const name = `${firstname} ${lastname}`
    const phoneNumber = `${countrycode}${phoneNo}`
      const emailRes = await mailSender(
          email,
          "Your Contact Details Received successfully!",
          contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
        )
        const contactData = await Contact.create({
            name,email,phoneNo:phoneNumber,message
        })
    // console.log("Email Res ", emailRes)
    // console.log("Data Contact ", contactData)
    return res.json({
      success: true,
      message: "Email send successfully!",
    })
  } catch (error) {

    console.log("Error message Contact: ", error.message)
    return res.json({
      success: false,
      message: "Internal Server Error",
    })
  }
}
const contactData = async(req,res)=>{
    try {
        const contactData = await Contact.find({})
        return res.json({
            success:true,
            message:contactData
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error!"
        })
    }
}
module.exports  = {
    contactData,
    contactUs
}