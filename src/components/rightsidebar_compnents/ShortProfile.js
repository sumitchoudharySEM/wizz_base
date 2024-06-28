"use client";
import React from "react";
import { useState, useEffect } from "react";
import { MODULEADDRESS, NEXT_PUBLIC_GATEWAY_URL } from "../../app/constants";
import { toast } from "react-toastify";
import Link from "next/link";

import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import { Aptos } from "@aptos-labs/ts-sdk";

const aptos = new Aptos();

const ShortProfile = (props) => {
  const { signAndSubmitTransaction } = useWallet();
  const [isProfile, setIsProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    username: "",
    image_cid: "",
    owner: "",
    bio: "",
  });

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const fetchUserProfile = async () => {
    try {
      const ProfileResource = await aptos.getAccountResource({
        accountAddress: props.data,
        resourceType: `${MODULEADDRESS}::wizz::Profile`,
      });
      setUser({
        name: ProfileResource.full_name,
        username: ProfileResource.username,
        image_cid: ProfileResource.profile_image_ref,
        owner: ProfileResource.owner,
        bio: ProfileResource.bio,
      });
      setIsProfile(true);
      console.log("ProfileResource", ProfileResource);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isProfile == true) {
      let adminFollowing = props.userProfile.following;
      let isAdminFollowing = adminFollowing.includes(props.data);
      setIsFollowing(isAdminFollowing);
    }
  }, [isProfile]);

  return (
    <>
      <div className=" py-2 flex space-x-4 align-middle justify-between ">
        <Link href={`/profile/${user.owner}`} passHref>
          <div className="flex space-x-4 align-middle">
            <div className="">
              <img
                className="rounded-full h-12 w-12"
                src={`${NEXT_PUBLIC_GATEWAY_URL}/ipfs/${user.image_cid}`}
                alt=""
              />
            </div>
            <div className="flex flex-col text-white justify-center">
              <div className="text-lg font-medium text-[#F3F3F3] text-opacity-90">
                {user.name}
              </div>
              <div className="text-sm font-light text-[#D9D9D9]">
                @{user.username}
              </div>
            </div>
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          {isFollowing ? (
            <button
              onClick={async () => {
                const transaction = {
                  data: {
                    function: `${MODULEADDRESS}::wizz::unfollow_profile`,
                    functionArguments: [props.data],
                  },
                };

                const response = await signAndSubmitTransaction(transaction);

                await aptos.waitForTransaction({
                  transactionHash: response.hash,
                });
                toggleFollow();
                toast.success("Unfollowed successfully");
              }}
              className=" border-[1px] py-2 border-white px-7 w-full text-sm text-white  rounded-full font-medium"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={async () => {
                const transaction = {
                  data: {
                    function: `${MODULEADDRESS}::wizz::follow_profile`,
                    functionArguments: [props.data],
                  },
                };

                const response = await signAndSubmitTransaction(transaction);

                await aptos.waitForTransaction({
                  transactionHash: response.hash,
                });
                toggleFollow();
                toast.success("Followed successfully");
              }}
              className="bg-[#7501E9] py-2 px-7 w-full text-sm text-white border-none rounded-full font-medium"
            >
              Follow
            </button>
          )}
        </div>
      </div>
      {props.setbio && props.setbio == true ? (
        <div className=" text-[#D9D9D9] text-sm mb-6 pl-0">{user.bio}</div>
      ) : (
        ""
      )}
    </>
  );
};

export default ShortProfile;
