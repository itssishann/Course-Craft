import React from 'react'
import toast from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import "./App.css"
import Navbar from './components/common/Navbar'
import Error from './pages/Error'
import ForgotPassword from './pages/ForgotPassword'
import OpenRoute from './components/core/auth/OpenRoute'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import Signup from './pages/Signup'

import About from './pages/About'
import ContactForm from './components/core/contactPage/ContactForm'
import { ACCOUNT_TYPE } from "./utils/constants";
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/core/auth/PrivateRoute'
import MyProfile from './components/core/Dashboard/MyProfile'
import Settings from './components/core/Dashboard/Settings/Settings'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import { useSelector } from 'react-redux'
import Cart from './components/core/Dashboard/Cart'
import AddCourse from './components/core/Dashboard/AddCourse'
import CourseInformationForm from './components/core/Dashboard/AddCourse/CourseInformation/CourseInformationForm'
const App = () => {
  const { user } = useSelector((state) => state.profile)

  return (
     <div className="w-screen min-h-screen text-white bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
     <Route path='/' element={<Home/>}></Route>
     <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

<Route
          path="/about"
          element={
            
              <About />
            
          }
        />
<Route
          path="/contact"
          element={
            
              <ContactForm />
            
          }
        />
     <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  
     <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        
    <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
     <Route path='/dashboard/my-profile' element={<MyProfile/>}></Route>
     <Route path="dashboard/Settings" element={<Settings />} />
     
     {
       user?.accountType === ACCOUNT_TYPE.STUDENT && (
         <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}></Route>
          </>
        )
      }
     {
       user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
         <>
          <Route path="dashboard/add-course" element={<AddCourse />} />
          
          </>
        )
      }
     </Route>
     <Route path='/*' element={<Error/>}></Route>
     <Route path='/test' element={<CourseInformationForm/>}></Route>
     </Routes>
    </div>
  )
}

export default App