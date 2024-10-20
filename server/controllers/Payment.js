const Z = require("zod");
const instance = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseEnrollmentEmail = require("../mail/Templates/courseEnrollmentEmail");
const crypto = require('crypto');

const capturePayment = async (req, res) => {
    const capturePaymentSchema = Z.object({
        courseId: Z.string().length(24),
        userId: Z.string().length(24),
    });

    try {
        const result = capturePaymentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Course ID and User ID are required.",
                data: result.error.errors,
            });
        }

        const { courseId, userId } = result.data;
        let course;

        try {
            course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "No course found.",
                });
            }

            // Check if the user has already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled.",
                });
            }
        } catch (error) {
            console.log("Error while finding course -> ", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error while retrieving course.",
            });
        }

        // Calculate total amount
        const totalAmount = course.price * 100;

        // Generate a unique receipt ID 
        const receiptId = crypto.randomBytes(12).toString("hex"); // 32-character hex string

        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: receiptId,
            notes: {
                courseId,
                userId
            },
        };

        // Create an order in Razorpay
        try {
            const paymentResponse = await instance.orders.create(options);
            return res.json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                amount: paymentResponse.amount,
                currency: paymentResponse.currency,
                orderId: paymentResponse.id, 
            });
        } catch (error) {
            console.log("Problem with payment order -> ", error);
            return res.status(500).json({
                success: false,
                message: "Problem while initiating an order.",
            });
        }

    } catch (error) {
        console.log("Problem while payment capture -> ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};


const verifySignature = async(req,res)=>{
    try {
        const webhooksecret=4 ;
        const signature = req.headers["x-razorpay-signature"]
      const shaSum =   crypto.createHmac("sha256",webhooksecret)
      shaSum.update(JSON.stringify(req.body))
      const digest = shaSum.digest("hex")
      if(signature === digest){
            console.log("Payment Authorized!")
            const {courseId,userId} = req.body.payload.payment.entity.notes
            //add the studentId  in Course enrolled 
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},
                {
                    $push:{
                        studentsEnrolled:userId
                    }
                },{new:true}
            )
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found."
                })
            }
            console.log("Enrolled Course-> ",enrolledCourse)
            const enrolledStudent = await User.findOneAndUpdate(
                                  {_id:userId},
                                  {$push:{
                                    courses:courseId
                                  }},
                                  {new:true}
                                  
                              )
                              //send email for course purchased success
                            const emailResponse =  await mailSender(enrolledStudent.email,`Payment Successfull for ${enrolledCourse.courseName}`,paymentSuccessEmail(enrolledStudent.name,enrolledCourse.price,"orderUd","paymentId"))
                            return res.status(200).json({
                                success: true,
                                message: "Payment verified and course enrollment is successful.",
                            });
                
      }
      else{
        return res.status(401).json({
            success:false,
            message:"Payment is not legit."
        })
      }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Payment is not legit."
        })
    }
}
module.exports={
    capturePayment,verifySignature
}