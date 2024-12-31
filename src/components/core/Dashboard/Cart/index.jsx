import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {
    const {total,totalItems} = useSelector((state)=>state.auth)
  return (
    <div>
        <h1>Your Cart</h1>
        <p>{totalItems} in  your Course Cart</p>
        {
            total>0 ? (<>
            <RenderCartCourses/>
            <RenderTotalAmount/>
            </>) : (<><p>Your Course Cart is Empty</p></>)
        }
    </div>
  )
}

export default Cart