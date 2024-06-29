import React, {useState, useEffect} from "react";
import JobCard from "./jobCard";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { JOBS_CONTRACT_ADDRESS, PINATA_JWT } from "../../app/constants";
import abi from "../../app/contract/jobsabi.json";

const JobList = () => {
  const [allJobs, setAllJobs] = useState();

  const { data, error } = useReadContract({
    abi,
    address: JOBS_CONTRACT_ADDRESS,
    functionName: "getAllJobs",
    args: [],
  });

  useEffect(() => {
    console.log("data:", data);
    console.log("error:", error);
    if (data !== undefined) {
      setAllJobs(data);
    }
  }, [data, error]);

  return (
    <div>
        {allJobs && Object.keys(allJobs).length > 0 ? (
            allJobs.map((item, index) => (
            <div key={index}>
                <JobCard item={item} />
            </div>
            ))
        ) : (
            <></>
        )}
    </div>
  );
};

export default JobList;
