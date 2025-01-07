import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import IconBtn from '../../../../common/IconBtn'
import { MdAddCircleOutline } from "react-icons/md";
const CourseBuilder = () => {
  const {register,handleSubmit,setValue,formState:{errors}} = useForm()
  const [editSectionName,setEditSectionName] = useState(true)
  return (
    <div>
      <h2>Course Builder</h2>
      <form action="">

      </form>
      <div>
        <label>Section <sup className='z-10 text-pink-300'>*</sup></label>
        <input className='w-full text-richblack-700' type="text" name='sectionName' placeholder='Add Section for your Course..' {...register("sectionName",{required:true})}/>
        {
          errors.sectionName&&(
            <span className='text-yellow-50 font-medium'>Section name is required.</span>
          )
        }
        </div>
        <div className='flex justify-around'>
          <IconBtn outline={true} type={"submit"} customClasses={"mt-2"} text={editSectionName ?  "Edit Section Name" : "Create Section"}>
            <MdAddCircleOutline className='text-xl text-yellow-50 '/>
          </IconBtn>
          {
            editSectionName && (
              <button className="text-sm hover:text-pure-greys-200 ease-in duration-200 font-bold underline text-pure-greys-300">
                Cancel Edit
              </button>
            )
          }
        </div>
    </div>
  )
}

export default CourseBuilder