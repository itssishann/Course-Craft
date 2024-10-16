const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})
const sendVerificationEmail = async(email,otp)=>{
        try {
            const response = await mailSender(email,"Verification OTP email from CourseCraft",otp)
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