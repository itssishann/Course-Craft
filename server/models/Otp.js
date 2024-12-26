const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const otpTemplate = require("../mail/Templates/emailOTPTemplate")
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes and automatically remove from database
    attempts: { type: Number, default: 0 }, // Track the otp verification attempts or Track invalid attempts
})
const sendVerificationEmail = async(email,otp)=>{
        try {
            const response = await mailSender(email,"OTP Verification - CourseCraft",otpTemplate(otp))
            console.log("Email Sent Successfully!",response)
        } catch (error) {
            console.log(`Error while sending an email-> `,error)
            throw error;
        }
}
otpSchema.pre("save",async function(next){
   await sendVerificationEmail(this.email,this.otp) 
   next()
})

module.exports = mongoose.model("OTP",otpSchema)