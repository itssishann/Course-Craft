const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.split(" ")[1];

    // Check if token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found.",
      });
    }

    // Token verification
    try {
      const decoded =  jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token -> ", decoded);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the token!",
    });
  }
};
//isStudent middleware
exports.isStudent = async (req, res, next) => {
    try {
      // Check if the user has a Student account type
      if (req.user.accountType !== "Student") {
        return res.status(403).json({
          success: false,
          message: "Protected route for student users only.",
        });
      }
  
      // Proceed to the next middleware or route
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Problem while verifying the user role.",
      });
    }
  };
  
  //isInstructor middleware

  exports.isInstructor = async (req, res, next) => {
    try {
      // Check if the user has a Student account type
      if (req.user.accountType !== "Instructor") {
        return res.status(403).json({
          success: false,
          message: "Protected route for Instructor users only.",
        });
      }
  
      // Proceed to the next middleware or route
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Problem while verifying the user role.",
      });
    }
  };
  
  //isAdmin middleware
  exports.isAdmin = async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access: User not authenticated.",
        });
      }
  
      // Check if the Admin role user exists in the database
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
      // Check if the user's account type is Admin
      if (user.accountType !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: This route is restricted to Admin users only.",
        });
      }
  
      // Proceed to the next middleware or route
      next();
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({
        success: false,
        message: "Internal server error while verifying user role.",
      });
    }
  };
  
  