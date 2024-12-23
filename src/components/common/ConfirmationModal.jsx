import React, { useEffect, useState } from "react";
import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  const [isVisible, setIsVisible] = useState(false);

  // Add a slight delay to trigger the animation after the modal renders
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000]  grid place-items-center overflow-auto bg-richblack-700 bg-opacity-10 backdrop-blur-sm">
      <div
        className={`w-11/12 max-w-[350px] rounded-lg border border-b-4 border-l-4  border-richblack-400 bg-richblack-900 p-6 transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center  gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
