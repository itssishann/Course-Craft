import React from 'react'
import RenderSteps from './RenderSteps'

const AddCourse = () => {
  return (
    <div className="flex w-full items-start gap-x-6">
<div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Add Course
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips Component  */}
        <div className='hidden h-1/5 w-5/12 sticky top-4 bg-richblack-800 px-4 py-5 mt-4 rounded-lg lg:grid'>
            <h2 className="mb-8 text-lg text-richblack-5">⚡Course Upload Tips</h2>
            <ul className="ml-5 list-item list-disc space-y-5 text-sm text-richblack-5">
            <li>Set the Course Price.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
               and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important news.</li>
            <li>Notes to all enrolled students at once.</li>
            </ul>
        </div>
    </div>
  )
}

export default AddCourse