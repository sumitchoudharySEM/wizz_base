"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components";
import { CONTRACT_ADDRESS } from "../../../../app/constants";
import { useReadContract } from "wagmi";
import abi from "../../../../app/contract/abi.json";

const Profile = () => {
  const { username } = useParams();
  console.log(username);

  const [userProfile, setUserProfile] = useState({
    owner: "",
    name: "",
    username: "",
    bio: "",
    image_cid: "",
    banner_cid: "",
    time_created: "",
    following: [],
    followers: [],
  });

  const { data: profileResource, error: isError } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getUserProfileByUsername",
    args: [username],
  });

  useEffect(() => {
    if (profileResource !== undefined) {
      setUserProfile({
        owner: profileResource.userAddress,
        name: profileResource.name,
        username: profileResource.username,
        bio: profileResource.bio,
        image_cid: profileResource.imageCID,
        banner_cid: profileResource.bannerCID,
        time_created: profileResource.timeCreated,
        following: profileResource.following,
        followers: profileResource.followers,
      });
    }
  }, [profileResource, isError]);

  return (
    <div className="lg:w-[65%] md:w-[80%] w-[85%] flex flex-col align-middle my-3 h-full min-h-screen p-t-20 ">
      {userProfile.name !== "" ? <Topbar profile={userProfile} /> : <></>}
    </div>
  );
};

export default Profile;
