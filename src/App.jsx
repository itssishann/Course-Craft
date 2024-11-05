import React from 'react'
import toast from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import "./App.css"
const App = () => {
  return (
     <div className="w-screen min-h-screen text-white bg-richblack-900 flex flex-col font-inter">
      <Routes>
     <Route path='/' element={<Home/>}></Route>
     </Routes>
    </div>
  )
}

export default App