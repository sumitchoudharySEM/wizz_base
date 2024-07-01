"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  JOBS_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
  PINATA_JWT,
  NEXT_PUBLIC_GATEWAY_URL,
} from "../../../../../constants";
import abi from "../../../../../contract/jobsabi.json";
import abii from "../../../../../contract/abi.json";
import { useParams } from "next/navigation";
import Link from "next/link";

const page = () => {

  const { jobid, username } = useParams();
  const[application, setApplication] = useState();

  const { data: owner, error: isError } = useReadContract({
    abi: abii,
    address: CONTRACT_ADDRESS,
    functionName: "getUserProfileByUsername",
    args: [username],
  });

  const { data: ApplicationAdd, error } = useReadContract({
    abi,
    address: JOBS_CONTRACT_ADDRESS,
    functionName: "getApplicationsByApplicant",
    args: [username],
  });

  const { data: ApplicationData, error:ApplicationDataError  } = useReadContract({
    abi,
    address: JOBS_CONTRACT_ADDRESS,
    functionName: "getApplicationsByApplicant",
    args: [username],
  });

  useEffect(() => {
    if (owner !== undefined && Applications !== undefined) {
      console.log("Applications:", Applications);
      console.log("owner:", owner);
      setApplication(Applications.filter((item) => item.jobID == jobid));
    }
  }, [owner, Applications]);

  useEffect(() => {
    console.log("application:", application);
  }, [application]);

  useEffect(() => {
    console.log("error:", error);
    console.log("isError:", isError);
  }, [error,isError ]);


  // get user frofile from username and show
  //  getApplicationsByApplicant find application with jobid = jobid and show its data

  return (
    <>
    {application && application.applicationId !== undefined  ? 
    <div className="lg:w-[65%] md:w-[80%] w-[85%] flex flex-col align-middle my-3 h-full min-h-screen p-t-20 ">
            <div className="bg-[#0b0b0b] mt-3 mb-3 rounded-md">
              <Link href={`/profile/${owner.username}`}>
                <div className="flex space-x-4 align-middle p-2 ">
                  <div>
                    <img
                      className="rounded-full h-12 w-12"
                      src={`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${owner.imageCID}`}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col text-white justify-center">
                    <div className="text-xl font-medium">{owner.name}</div>
                    <div className="text-xs font-normal text-[#D9D9D9]">
                      @{owner.username}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
      
    </div>
    : <></>}
    </>
  )
}

export default page
