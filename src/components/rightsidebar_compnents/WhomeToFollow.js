"use client";
import React, { use } from "react";
import ShortProfile from "./ShortProfile";
import { CONTRACT_ADDRESS } from "../../app/constants";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import abi from "../../app/contract/abi.json";


const WhomeToFollow = ({ userProfile }) => {
  // const [allProfilesAddress, setAllProfilesAddress] = useState([]);

  //get all profiles
  const { data: allProfiles, error: Error } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getAllUserAccounts",
    args: [],
  });

  useEffect(() => {
    if (allProfiles !== undefined) {
      console.log("allProfiles:", allProfiles);
    }
  }, [allProfiles, Error]);

  return (
    <div>
      <div className="text-[#A4A4A4]  text-opacity-90 ">Whome to Follow</div>
      <div className="mb-4">
        {allProfiles && allProfiles.map((item, index) => (
          <div key={index}>
            <ShortProfile data={item} userProfile={userProfile} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhomeToFollow;
