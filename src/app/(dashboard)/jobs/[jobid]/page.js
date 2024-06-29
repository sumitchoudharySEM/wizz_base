"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  JOBS_CONTRACT_ADDRESS,
  CONTRACT_ADDRESS,
  PINATA_JWT,
  NEXT_PUBLIC_GATEWAY_URL,
} from "../../../constants";
import abi from "../../../contract/jobsabi.json";
import abii from "../../../contract/abi.json";
import { useParams } from "next/navigation";
import Link from "next/link";

const JobView = () => {
  const { jobid } = useParams();
  const { address } = useAccount();
  const [creater, setCreater] = useState();
  const [url, setUrl] = useState();
  const [detailedDescription, setDetailedDescription] = useState();

  const [job, setJob] = useState();
  const { data, error } = useReadContract({
    abi,
    address: JOBS_CONTRACT_ADDRESS,
    functionName: "getJobByJobID",
    args: [jobid],
  });

  useEffect(() => {
    console.log("data:", data);
    console.log("error:", error);
    if (data !== undefined) {
      setJob(data);
      setUrl(`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data.descriptionIPFS}`);
    }
  }, [data, error]);

  const { data: owner, error: isError } = useReadContract({
    abi: abii,
    address: CONTRACT_ADDRESS,
    functionName: "getUserProfileByUsername",
    args: [data?.employerUsername],
  });

  useEffect(() => {
    if (owner !== undefined) {
      setCreater(owner);
    }
  }, [owner, isError]);

  async function fetchDataFromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  useEffect(() => {
    if (url !== undefined) {
      fetchDataFromUrl(url).then((data) => {
        setDetailedDescription(data);
        console.log("Detailed discription:", data);
      });
    }
  }, [url]);

  return (
    <>
      {job && job.employer !== undefined ? (
        <div className="lg:w-[65%] md:w-[80%] w-[85%] flex flex-col align-middle my-3 h-full min-h-screen p-t-20 ">
          {creater !== undefined && creater.username !== undefined ? (
            <div className="bg-[#0b0b0b] mt-3 mb-3 rounded-md">
              <Link href={`/profile/${creater.username}`}>
                <div className="flex space-x-4 align-middle p-2 ">
                  <div>
                    <img
                      className="rounded-full h-12 w-12"
                      src={`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${creater.imageCID}`}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col text-white justify-center">
                    <div className="text-xl font-medium">{creater.name}</div>
                    <div className="text-xs font-normal text-[#D9D9D9]">
                      @{creater.username}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <></>
          )}
          <div className="text-white  flex flex-col ">
            <div>
              <img
                className="w-full h-36 rounded-xl"
                src="https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjA4fHxiYW5uZXJ8ZW58MHx8MHx8fDA%3D"
                alt=""
              />
            </div>
            <div className="mt-5">
              <div className="flex flex-row text-white justify-between">
                <div className="text-3xl font-semibold">{job.title}</div>
                <div className="flex flex-col  justify-end align-bottom">
                  {job.employer == address ? (
                    <button className="pt-1 pb-1 px-10 flex-col align-bottom justify-end text-[#e2e2e2] border-while border-2  rounded-lg font-sm font-normal">
                      Edit
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className=" my-2">{job.shortDescription}</div>
              <div className="flex space-x-4">
                <div className="flex space-x-2 align-middle">
                  <div className="text-md text-[#a6a6a6] ">
                    {job.applicantsUsername ? job.applicantsUsername.length : 0}
                  </div>
                  <div className="flex flex-col  justify-center text-[#979797] text-opacity-90 text-md">
                    Applicants
                  </div>
                </div>
              </div>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3">
                Apply Now
              </button>
              <hr className="mt-3 mb-3 opacity-30 " />
              {detailedDescription && detailedDescription.detailedDescription ? 
                <div className="text-[#e9e9e9] text-md">{detailedDescription.detailedDescription}</div> : <></>
              }
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default JobView;
