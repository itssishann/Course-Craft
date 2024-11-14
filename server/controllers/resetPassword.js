const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const clientURL = process.env.CLIENT_URL;

const TOKEN_EXPIRATION_TIME = 360000; //0.1hour i.e 6 minutes expiry

const resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email || !validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address.",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Email ${email} is not correct or internal server error!.`,
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + TOKEN_EXPIRATION_TIME,
            },
            { new: true }
        );

        const url = `${clientURL}/update-password/${token}`;
        const date = new Date()
		const currentYear = date.getFullYear()
        await mailSender(
            email,
            "Password Reset Request",
            `
            <html>
                <body>
                    <h2>Password Reset Request..</h2>
                    <p>Hi there,</p>
                    <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
                    <p><a href="${url}" style="color: #1a73e8; text-decoration: none;">Reset Your Password</a></p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                    <p>Thank you!</p>
                    <p>Best regards,<br>Course Craft</p>
                    <footer>© ${currentYear} Course Craft. All rights reserved.</footer>
                </body>
            </html>
            `
        );

        res.json({
            success: true,
            message: "Email sent successfully! Please check your inbox to reset your password.",
        });
    } catch (error) {
        console.error("Error sending reset password email:", error); // Improved logging
        res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset password email.",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match.",
            });
        }
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token not Received!"
            })
        }
        const userDetails = await User.findOne({ token });
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token.",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Token has expired. Please regenerate your token.",
            });
        }

        const hashPass = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token },
            { password: hashPass, token: null, resetPasswordExpires: null }, // Clear token after use
            { new: true }
        );

        res.json({
            success: true,
            message: "Password reset successful!",
        });
    } catch (error) {
        console.error("Error resetting password:", error); // Improved logging
        res.status(500).json({
            success: false,
            message: "Error while updating the password.",
            error: error.message,
        });
    }
};


// Simple email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

module.exports={
    resetPassword,resetPasswordToken
}