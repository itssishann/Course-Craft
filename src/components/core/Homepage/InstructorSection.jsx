import React from 'react'
import InstructorImage from "../../../assets/images/instructor-2.jpg"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowAltCircleRight } from 'react-icons/fa'
const InstructorSection = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row mt-14 items-center'>
            <div className='w-3/4 md:w-1/2'>
            <img src={InstructorImage} className='md:h-[32rem] shadow-richblack-25 shadow-xl  rounded-sm' alt="Instructor Image" />
            </div>
            <div className='w-5/6 md:w-1/2 flex flex-col gap-8 '>
                <h3 className='text-4xl font-semibold  w-1/2'>Become an <HighlightText text={"Instructor"}/></h3>
                <p className='font-medium text-[1rem] text-richblack-300'>
                Instructors from around the world teach millions of students on Course Craft. We provide the tools and skills to teach what you love.
                </p>
                <div className='mx-auto flex items-center w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                 <span className='flex items-center'>Start Teaching Today <FaArrowAltCircleRight className='ml-2'/></span>
                </CTAButton>
                </div>
            </div>
    </div>
  )
}

export default InstructorSection