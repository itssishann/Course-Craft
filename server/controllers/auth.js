const User = require("../models/User")
const otpGenerator = require("otp-generator")
const Otp = require("../models/Otp")
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Profile = require("../models/Profile")
const mailSender = require("../utils/mailSender")
const otpTemplate = require("../mail/Templates/emailOTPTemplate")

// sendOTP 
// otp send when user try to register on course signup
const otpSchema = z.object({
    email: z.string().email("Invalid email format"),
  });
  const sendOTP = async (req, res) => {
    try {
        const result = otpSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error.errors
            });
        }
   
        const { email } = result.data;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(401).json({
                success: false,
                message: "User already registered!"
            });
        }
   
        let otp;
        let isOTPExist;
   
        // Generate unique OTP
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            isOTPExist = await Otp.findOne({ otp });
        } while (isOTPExist);
   
        const otpPayload = { email, otp };
        await Otp.create(otpPayload);  // Store the OTP after ensuring it's unique
   
        // Send OTP Email
        // await mailSender(email, "OTP Verification", otpTemplate(otp));
   
        return res.json({
            success: true,
            message: "Otp sent successfully!"
        });
   
    } catch (error) {
        console.log("Otp Error -> ", error);
        return res.status(500).json({
            success: false,
            message: error
        });
    }}
//signup
const signUpSchema = z.object({
    email: z.string().email("Invalid email format!"),
  firstName: z.string().min(2, "First name should be at least 2 characters long"),
  lastName: z.string().min(2, "Last name should be at least 2 characters long"),
  password: z.string().min(6, "Password should be at least 6 characters long"), // Consider adding min length for security
  confirmPassword: z.string().min(6, "Confirm password should be at least 6 characters long"), // Same as password
  otp: z.string().length(6, "OTP should be exactly 6 characters long")
})
const signUp = async(req,res)=>{
    try {
        const result = signUpSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.error.errors // Returns validation error
            });
          }
          const{email,firstName,lastName,password,confirmPassword,otp} = result.data
          const isUserExist = await User.findOne({email})
          if(isUserExist){
            return res.status(401).json({
                success:false,
                message:"Email already registered!"
            })
          }
          if(confirmPassword!==password){
                return res.status(401).json({
                    success:false,
                    message:"Password and confirm password is not correct."
                })
          }
        //  recent otp genrated for the email
            const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);
            console.log("Recent otp is -> ",recentOtp)

            // validateOTP
            if (recentOtp.length === 0) {
                // OTP not found for the email
                return res.status(400).json({
                  success: false,
                  message: "The OTP is not valid",
                })
              } else if (otp !== recentOtp[0].otp) {
                // Invalid OTP
                return res.status(400).json({
                  success: false,
                  message: "The OTP is not valid",
                })
              }
          const hashPassword = await bcrypt.hash(password,10)
          const profileDetails = await Profile.create({
            gender:null,
            dob:null,
            about:null,
            contactNumber:null,

          })
          const user= await User.create({
            firstName,
            lastName,
            email,
            additionalDetails:profileDetails._id,
            password:hashPassword,
            image:`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${firstName}+${lastName}`
          })
          return res.json({
            success:true,
            message:"User signup success!",
            user
          })
    } catch (error) {
        console.log("Signup Error -> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while signing up the user!"
        })
    }
}
// login
const loginSchema = z.object({

    email: z.string().email("Invalid email format!"),
    password: z.string().min(6, "Password should be at least 6 characters long")
})
const login = async(req,res)=>{
    try {
        const isParsedLogin = loginSchema.safeParse(req.body)
        if(!isParsedLogin.success){
            return res.status(400).json({
                success:false,
                message: isParsedLogin.error.errors// Returns validation error
            })
        }
        const {email,password} = isParsedLogin.data
        const isUserExist = await User.findOne({email}).populate("additionalDetails")
        if(!isUserExist){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password."
            })
        }
        const isPasswordValid = await bcrypt.compare(password,isUserExist.password)
        if(!isPasswordValid){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password."
            })
        }
        const payload = {
            email:isUserExist.email,
            id:isUserExist._id,
            accountType:isUserExist.accountType
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"7d"
        })
        const options = {
            httpOnly: true,           // Ensures the cookie is only accessible via HTTP(S), not JavaScript
            secure: process.env.NODE_ENV === 'production', // Cookie sent only over HTTPS in production
            sameSite: 'strict',         
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            // Alternatively, you could use maxAge for the same result:
            // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
          };
          
        res.cookie("token",token,options).json({
            success:true,
            token,
            message:"user logged in!"
        })
    } catch (error) {
        console.log("Login Error -> ",error)
        return res.status(500).json({
            success:false,
            message:"Problem while login the user!"
        })
    }
}
const logout = (req, res) => {
  try {
      // Clear the token cookie by setting its expiration date to the past
      res.cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: new Date(0), // Set the expiration date to the past
      });

      return res.status(200).json({
          success: true,
          message: "User logged out successfully!"
      });
  } catch (error) {
      console.log("Logout Error -> ", error);
      return res.status(500).json({
          success: false,
          message: "Problem while logging out the user!"
      });
  }
};
//change-password
const changePasswordSchema = z.object({
    oldPassword: z.string().min(6, "Old password should be at least 6 characters long"), // Adjust min length based on your requirements
    password: z.string().min(6, "Password should be at least 6 characters long"), // New password with validation
    confirmPassword: z.string().min(6, "Confirm password should be at least 6 characters long") // Confirm new password
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });
  const changePassword = async (req, res) => {
    try {
      const result = changePasswordSchema.safeParse(req.body);
  
      // Validate input schema
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error.errors[0].message,
        });
      }
  
      const { password, oldPassword, confirmPassword } = result.data;
  
      // Check if new password and confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match.",
        });
      }
  
      const userId = req.user.id;
      const email = req.user.email
  
      // Fetch the user from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect.",
        });
      }
  
      // Hash the new password
      const hashPassword = await bcrypt.hash(password, 10);
  
      // Update user's password
      user.password = hashPassword;
      await user.save();
       const response =  await mailSender(email,"Password Changed Successfully!." , `Dear ${user.name},\n\nYour password has been successfully changed. If you did not make this request, please contact our support team immediately.\n\nBest regards,\nCourse Craft`)
      return res.json({
        success: true,
        message: "Password changed successfully.",
      });
      
    } catch (error) {
      console.log("Password change Error ->", error);
      return res.status(500).json({
        success: false,
        message: "Problem while changing the password!",
      });
    }
  };

module.exports={
    sendOTP,signUp,changePassword,login,logout
}