import React from 'react'
import { FaArrowAltCircleDown } from 'react-icons/fa'
import Logo1 from "../../../assets/TimeLine-Section/Logo1.svg"
import Logo2 from "../../../assets/TimeLine-Section/Logo2.svg"
import Logo3 from "../../../assets/TimeLine-Section/Logo3.svg"
import Logo4 from "../../../assets/TimeLine-Section/Logo4.svg"
import TimelineImage from "../../../assets/images/TimelineImage.png"
const TimelineSection = () => {
    const TimeLine = [
        {
          Logo: Logo1,
          Heading: "Leadership",
          Description: "Fully committed to the success company",
        },
        {
          Logo: Logo2,
          Heading: "Responsibility",
          Description: "Students will always be our top priority",
        },
        {
          Logo: Logo3,
          Heading: "Flexibility",
          Description: "The ability to switch is an important skills",
        },
        {
          Logo: Logo4,
          Heading: "Solve the problem",
          Description: "Code your way to a solution",
        },
      ];
  return (
    <div className='flex w-11/12 flex-row gap-2 items-center'>
        <div className='flex ml-4 gap-4 flex-col w-full md:w-1/2 '>
            {TimeLine.map((i,index)=>{
                return(
                    <div key={index} className='flex  gap-6 '>
                       <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md drop-shadow-md shadow-richblack-400 bg-white ">
                       <img  src={i.Logo} alt={i.Heading}  />
                       </div>
                    <div>
                        <h4 className='font-semibold text-[1.15rem] text-s'>{i.Heading}</h4>
                        <p className='text-base'>{i.Description}</p>
                    </div>
                    </div>
                )
            })}
        </div>
        <div className="relative hidden md:flex shadow-blue-200 ">
        <img className='shadow-white rounded-md h-fit' src={TimelineImage} alt="TimeLine Image"  /> 
        <div className="absolute select-none bg-caribbeangreen-700 z-4 top-[80%] translate-x-[10%] translate-y-[55%] flex rounded-md text-white uppercase py-6">
            <div className='flex gap-5  items-center border-r-2 px-5 border-caribbeangreen-300'>
                <h1 className='text-3xl font-bold'>10+</h1>
                <p className='text-caribbeangreen-300 text-base'>Years of Experience</p>
            </div>
            <div className='flex gap-5 items-center  px-5'>
                <h1 className='text-3xl font-bold'>25+</h1>
                <p className='text-caribbeangreen-300 text-base'>Types of Courses</p>
            </div>
            </div>           
        </div>
    </div>
  )
}

export default TimelineSection