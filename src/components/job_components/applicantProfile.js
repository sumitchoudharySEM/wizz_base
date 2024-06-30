"use client"
import React from 'react'
import Link from 'next/link'

const ApplicantProfile = (props) => {
    //get user by username
    
  return (
    <>
        <div className=" py-2 flex space-x-4 align-middle justify-between ">
          {/* <Link href={`/profile/${props.data.username}`} passHref> */}
          <Link href={`/profile/${props.item}`} passHref>
            <div className="flex space-x-4 align-middle">
              <div className="">
                <img
                  className="rounded-full h-12 w-12"
                //   src={`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${props.data.imageCID}`}
                  src=" https://cdn.dribbble.com/users/1584142/screenshots/10798275/media/1a0e2a0f5c3b7d1e6d7b5f1f8d1b0b7f.png"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-white justify-center">
                <div className="text-lg font-medium text-[#F3F3F3] text-opacity-90">
                  Name
                </div>
                <div className="text-sm font-light text-[#D9D9D9]">
                  @{props.item}
                </div>
              </div>
            </div>
          </Link>
          <div className="flex flex-col justify-center">
          {props.isCreator == true ? <>
          
            <button className=" border-[1px] py-2 border-white px-7 w-full text-sm text-white  rounded-full font-medium">
                Under Review
            </button>

            {/* <button className="bg-[#193cff] py-2 px-7 w-full text-sm text-white border-none rounded-full font-medium">
              Accepted
            </button> */}
            </> : <></>}
          </div>
        </div>
      </>
  )
}

export default ApplicantProfile
