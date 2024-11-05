import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/CTAButton';
import BannerVideo from"../assets/images/banner-student-video.mp4"
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import Footer from '../components/common/Footer';
const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className='relative mx-auto flex flex-col justify-between max-w-maxContent text-white items-center w-11/12'>
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor </p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
       {/* Heading  */}
        <div className='text-center text-4xl font-semibold mt-4'>
            <h4>
            Empower Your Future with
            <HighlightText text={"Coding Skills"}/>
            </h4>
        </div>
        {/* Sub Heading  */}
         <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        <div className="flex flex-row gap-7 mt-8">
        <CTAButton  active={true} linkto={"/signup"}>Learn more</CTAButton>
        <CTAButton linkto={"/signup"}> Book a Demo</CTAButton>
        </div>
        {/* Video  */}
          <div className="mx-auto my-7    w-3/4 lg:max-w-3xl  shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video className="w-full  shadow-[15px_15px_rgba(255,255,255)] max-w-full" muted loop autoPlay src={BannerVideo} type="video/mp4"></video> {/* Added max-w-full */}
        </div>
        </div>
        {/* Code Section - 1 */}
        <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              text: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>Home Page</title>\n</head>\n<body>\n<h1><a href="/">Welcome Student</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            gradientBackground={<div className="codeblock1 absolute"></div>}
          />

<div >
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              text: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeBlock={`const express = require('express');\nconst app = express();\nconst PORT = 3000;\n\napp.get('/', (req, res) => {\n  res.json({ message: "Welcome Student"})\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on localhost:\${PORT}\`);\n});`}
            gradientBackground={<div className="codeblock2 absolute"></div>}
          />
        </div>
        {/* Section 3 */}
        {/* Footer */}
        <Footer/>
        </div>
  )
}

export default Home