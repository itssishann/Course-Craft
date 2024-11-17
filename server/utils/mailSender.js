const nodemailer = require("nodemailer")
const mailSender = async(email,title,body)=>{
    try {
       const transporter = nodemailer.createTransport({
        host:process.env.MAIL_SMTP,
        auth:{
            user:process.env.MAIL_USERNAME,
            pass:process.env.MAIL_PASSWORD
        }
       }) 
       let info = await transporter.sendMail({
            from:"Admin Course Craft",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
       })
       console.log("Email Sent -> ",info)
       return info;
    } catch (error) {
        console.log("Email send problem -> ",error)
    }
}
module.exports = mailSender
// mailSender("proffuddeifefeu-7301@yopmail.com","Test Mail","<h1>Testing Success!</h1>")