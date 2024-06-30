import React, {useState, useEffect} from "react";
import JobCard from "./jobCard";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { JOBS_CONTRACT_ADDRESS, PINATA_JWT } from "../../app/constants";
import abi from "../../app/contract/jobsabi.json";
import { usePathname } from "next/navigation";

const JobList = () => {

  const pathname = usePathname().split("/");
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
      if(pathname[1] == "opportunities") {
        if(pathname[2] == "job") {
          setAllJobs(data.filter((item) => item.jobType == "Job"));
        } else if(pathname[2] == "internship") {
          setAllJobs(data.filter((item) => item.jobType == "Internship"));
        } else if(pathname[2] == "freelancing") {
          setAllJobs(data.filter((item) => item.jobType == "Freelancing"));
        } else if(pathname[2] == "bounty") {
          setAllJobs(data.filter((item) => item.jobType == "Bounty"));
        } else {
          setAllJobs(data);
        }
      } else {
        setAllJobs(data);
      }
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
