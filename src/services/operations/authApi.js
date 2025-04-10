import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints



export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // Get the OTP expiry time from localStorage
    // const otpExpiryTime = localStorage.getItem("otpEmailWaitTime");

    // If OTP expiry time exists, check if it's passed
    // if (otpExpiryTime && Date.now() < otpExpiryTime) {
    //   const remainingTime = otpExpiryTime - Date.now();
    //   const minutes = Math.floor(remainingTime / 60000);
    //   toast.error(`Please wait ${minutes}m before requesting another OTP.`);
    //   return;
    // }

    dispatch(setLoading(true));

    // Using toast.promise for automatic updates
    toast.promise(
      // The promise to monitor
      apiConnector("POST", SENDOTP_API, { email, checkUserPresent: true }),
      {
        loading: "Sending OTP...",
        success: (response) => {
          // Check if response indicates success
          if (response.data.success) {
            navigate("/verify-email");
            return "OTP Sent Successfully!";
          } else {
            throw new Error(response.data.message || "Failed to send OTP");
          }
        },
        error: (err) => {
          // Parse and return a meaningful error message
          if (err.response && err.response.data && err.response.data.message) {
            return err.response.data.message; // Show the message from the server
          }
          return err.message || "Failed to send OTP"; // Fallback to a generic message
        },

      },
      {
        // Optional toast options
        success: { duration: 3000 },
        error: { duration: 3000 },
      }
    ).finally(() => {
      dispatch(setLoading(false));
    });
  };
}



export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("Signup res>> ", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
     
      navigate("/login")
    } catch (error) {
      console.log("Signup Err>> ", error)
      const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage||"Wrong OTP!")
      //in wrong otp make it to same verify otp page only
      navigate("/verify-email")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("Login Res>> ", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN Err >>.", error)
      toast.error("Login Failed.")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logout Successfully!")
    navigate("/")
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email})

      console.log("Reset Password Email Result >> ", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent!");
      setEmailSent(true);
    }
    catch(error) {
      console.error("Reset Password token err>>", error);
      toast.error(`Failed to send email you are not registered or internal server error!.`);
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("Reset Password Result >> ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully!");
    }
    catch(error) {
      console.log("Reset Password Error", error);
      toast.error("Reset password token expired!");
    }
    dispatch(setLoading(false));
  }
}