import React from 'react'
import HighlightText from './HighlightText'
import Img2 from "../../../assets/images/Compare_with_others.svg"
import Img1 from "../../../assets/images/Know_your_progress.svg"
import Img3 from "../../../assets/images/Plan_your_lessons.svg"
import CTAButton from './CTAButton'
const LearningSection = () => {
  return (
    <div className='flex flex-col mt-24  gap-4'>
            <div>
                <h2 className='text-4xl font-semibold text-center'>Your swiss knife for <HighlightText text={"  learning any language"}/></h2>
            </div>
            <div className='text-center text-richblack-600 font-medium w-3/5 mx-auto text-base '>
            Using spin making learning multiple languages easy. with 10+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>
            <div className="flex items-center mt-4 justify-center">
                <img src={Img1} alt='Know-Your-Progress Image' className="object-contain -mr-32"/>
                <img src={Img2} alt='Compare with others Image' className="object-contain"/>
                <img src={Img3} alt='Plan your lesson Image' className="object-contain -ml-32"/>
            </div>
            <div className='w-fit mx-auto mb-9'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
            </div>
    </div>
  )
}

export default LearningSection