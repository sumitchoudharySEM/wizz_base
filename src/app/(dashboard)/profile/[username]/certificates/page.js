"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostList } from "@/components";
import { CONTRACT_ADDRESS } from "../../../../../app/constants";
import { useReadContract, useAccount } from "wagmi";
import abi from "../../../../../app/contract/abi.json";
import Link from "next/link";

const ProfileCertificates = () => {
    const { address } = useAccount();
    const [userProfile, setUserProfile] = useState({
      owner: "",
      name: "",
      username: "",
      bio: "",
      image_cid: "",
      banner_cid: "",
      profile_id: "",
      following: [],
      followers: [],
    });
    const { data: profileResource, error: isError } = useReadContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: "getUserProfileByAddress",
      args: [address],
    });
  
    useEffect(() => {
      if (profileResource !== undefined) {
        console.log("ProfileResource:", profileResource);
        setUserProfile({
          owner: profileResource.userAddress,
          name: profileResource.name,
          username: profileResource.username,
          bio: profileResource.bio,
          image_cid: profileResource.imageCID,
          banner_cid: profileResource.bannerCID,
          profile_id: profileResource.userNumber,
          following: profileResource.following,
          followers: profileResource.followers,
        });
      }
    }, [profileResource, isError]);
  
    return (
      <>
        {userProfile.owner !== "" ? (
          <PostList userProfile={userProfile} />
        ) : (
          <></>
        )}
      </>
    );
  };

export default ProfileCertificates;
