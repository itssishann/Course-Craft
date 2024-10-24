const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token -> ", decoded);
      req.user = decoded; // Attach user info to request

      // Check if the user  exists in the database
      const user = await User.findById(req.user.id);
      if (!user) {
       throw new Error
      }

      next(); // Proceed to the next middleware or route
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the token.",
    });
  }
};

// Middleware to check if the user is a student
exports.isStudent = (req, res, next) => {
  if (req.user?.accountType !== "Student") {
    return res.status(403).json({
      success: false,
      message: "Protected route for student users only.",
    });
  }
  next();
};

// Middleware to check if the user is an instructor
exports.isInstructor = (req, res, next) => {
  if (req.user?.accountType !== "Instructor") {
    return res.status(403).json({
      success: false,
      message: "Protected route for instructor users only.",
    });
  }
  next();
};

// Middleware to check if the user is an admin
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
        message: "User account has been deleted.",
      });
    }

    // Check if the user's account type is Admin
    if (user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: This route is restricted to Admin users only.",
      });
    }

    next();
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying user role.",
    });
  }
};
