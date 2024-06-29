"use client";
import React, {useEffect, useState} from "react";
import { useAccount, useWriteContract, useReadContract} from 'wagmi'
import {
  JOBS_CONTRACT_ADDRESS,
  PINATA_JWT,
} from "../../../constants";
import abi  from "../../../contract/jobsabi.json";

const CreateJob = () => {

  const { address } = useAccount()

  const [job, setJob] = useState({
    title: "",
    description: "",
    type: "",
    reward: "",
    detailedDiscription: "",
  });

  const { data: createJobData, error: createJobError, isPending: createJobIsPending, writeContract: createJobWriteContract } = useWriteContract();

  useEffect(() => {
    console.log("createJobData:", createJobData);
    console.log("createJobError:", createJobError);
  }, [createJobData, createJobError]);

  const handleSubmission = async () => {
    try {
    const detailedDescriptionData = {
      detailedDescription: job.detailedDiscription,
    };

    const detailedDescriptionJSON = JSON.stringify(detailedDescriptionData);

    const formData = new FormData();
    formData.append("file", new Blob([detailedDescriptionJSON], { type: "application/json" }));

    const metadata = JSON.stringify({
      name: "Detailed Description",
      keyvalues: {
        title: job.title,
        type: job.type,
      }
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    // Parse the response
    const resData = await res.json();
    console.log("Detailed description IPFS CID:", resData.IpfsHash);

    // Return the IPFS CID
    return resData.IpfsHash;
    } catch (error) {
      console.log(error);
      return null;
      // throw error; 
    }
  };

  return (
    <div className=" ">
  <div className="w-full h-full flex-[0.7] flex flex-col justify-center align-middle mt-8 mb-6 ">
    <div className="flex justify-between w-full">
      <div className="m-4">
        <div className="text-white text-3xl font-bold">
          Create a New Opportunity
        </div>
        <div className=" text-[#cbcbcb]">
          Provide details to post a job, internship, freelancing gig, or bounty
        </div>
      </div>
    </div>
    <>
      <div className="flex md:flex-row flex-col">
        <input
          onChange = {(e) => setJob({...job, title: e.target.value})}
          type="text"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Job Title"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <input
          onChange = {(e) => setJob({...job, description: e.target.value})}
          type="text"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Short Description: Provide a brief overview"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <select
          onChange = {(e) => setJob({...job, type: e.target.value})}
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option className="text-[#c3c3c3] pt-4 pb-4" disabled selected value="">
            Select Type of Opportunity
          </option>
          <option className="text-white pt-10 pb-10" value="Job">Job</option>
          <option className="text-white pt-10 pb-10" value="Internship">Internship</option>
          <option className="text-white pt-10 pb-10" value="Freelancing">Freelancing Gig</option>
          <option className="text-white pt-10 pb-10" value="Bounty">Bounty</option>
        </select>

        <input
          onChange = {(e) => setJob({...job, reward: e.target.value})}
          type="number"
          min="0"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Reward (USD)"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <textarea
          onChange = {(e) => setJob({...job, detailedDiscription: e.target.value})}
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          rows="6"
          placeholder="Detailed Description: Provide a detailed job description, perks and rewards, requirements, deadlines, and more."
        ></textarea>
      </div>

      {/* <div className="flex md:flex-row flex-col">
        <input
          type="file"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Upload Supporting Files (Optional)"
        />
      </div> */}

      {/* <!-- Submit Button --> */}
      <div className="w-[30%] m-4">
        <div className="space-y-6 py-4 bottom-0 flex flex-col">
          <button className="bg-[#7501E9] py-3 w-[90%] text-white border-none rounded-xl"
            onClick={async () => {
              try {
                let disCID = await handleSubmission();
                console.log("Job:", job);

                 createJobWriteContract({
                  abi,
                  address: JOBS_CONTRACT_ADDRESS,
                  functionName: "createJob",
                  args: [job.title, job.description, disCID, job.reward, job.type ],
                });
              } catch (error) {
                console.error("Error during submission:", error);
              }
            }}
          >
            Post Work
          </button>
        </div>
      </div>
    </>
  </div>
</div>

  );
};

export default CreateJob;
