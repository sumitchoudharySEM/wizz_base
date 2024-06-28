"use client";
import React from "react";
import { useState, useEffect } from "react";
import {NEXT_PUBLIC_GATEWAY_URL } from "../../app/constants";
import Link from "next/link";

const ShortProfile = (props) => {
  
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  useEffect(() => {
    // console.log("props.userProfile.following:", props.userProfile);
    if (props.userProfile.following.includes(props.data.username)) {
      setIsFollowing(true);
    } else {  
      setIsFollowing(false);
    }
  }, []);

  return (
    <>
      <div className=" py-2 flex space-x-4 align-middle justify-between ">
        <Link href={`/profile/${props.data.username}`} passHref>
          <div className="flex space-x-4 align-middle">
            <div className="">
              <img
                className="rounded-full h-12 w-12"
                src={`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${props.data.imageCID}`}
                alt=""
              />
            </div>
            <div className="flex flex-col text-white justify-center">
              <div className="text-lg font-medium text-[#F3F3F3] text-opacity-90">
                {props.data.name}
              </div>
              <div className="text-sm font-light text-[#D9D9D9]">
                @{props.data.username}
              </div>
            </div>
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          {isFollowing ? (
            <button
              // onClick={async () => {
              //   const transaction = {
              //     data: {
              //       function: `${MODULEADDRESS}::wizz::unfollow_profile`,
              //       functionArguments: [props.data],
              //     },
              //   };

              //   const response = await signAndSubmitTransaction(transaction);

              //   await aptos.waitForTransaction({
              //     transactionHash: response.hash,
              //   });
              //   toggleFollow();
              //   toast.success("Unfollowed successfully");
              // }}
              className=" border-[1px] py-2 border-white px-7 w-full text-sm text-white  rounded-full font-medium"
            >
              Unfollow
            </button>
          ) : (
            <button
              // onClick={async () => {
              //   const transaction = {
              //     data: {
              //       function: `${MODULEADDRESS}::wizz::follow_profile`,
              //       functionArguments: [props.data],
              //     },
              //   };

              //   const response = await signAndSubmitTransaction(transaction);

              //   await aptos.waitForTransaction({
              //     transactionHash: response.hash,
              //   });
              //   toggleFollow();
              //   toast.success("Followed successfully");
              // }}
              className="bg-[#7501E9] py-2 px-7 w-full text-sm text-white border-none rounded-full font-medium"
            >
              Follow
            </button>
          )}
        </div>
      </div>
      {props.setbio && props.setbio == true ? (
        <div className=" text-[#D9D9D9] text-sm mb-6 pl-0">{props.data.bio}</div>
      ) : (
        ""
      )}
    </>
  );
};

export default ShortProfile;
