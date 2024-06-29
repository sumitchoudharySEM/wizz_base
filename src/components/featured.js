"use client";
import React from "react";
import PostCard  from "./postCard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CONTRACT_ADDRESS, NEXT_PUBLIC_GATEWAY_URL } from "../app/constants";
import { useAccount, useReadContract } from "wagmi";
import abi from "../app/contract/abi.json";

const Featured = () => {
  const [allPosts, setAllPosts] = useState();

  const { data: Posts, error: isError } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getAllPosts",
    args: [],
  });

  useEffect(() => {
    if (Posts !== undefined) {
      console.log("Posts:", Posts);
      setAllPosts(Posts);
    }
  }, [Posts, isError]);

  return (
    <>
      {/* topbar */}
      <div className="lg:w-[65%] md:w-[80%] w-[85%] flex flex-col align-middle my-3 h-full ">
        <div className="sticky md:top-0 top-0 bg-[#14161b] backdrop-blur-md my-3 bg-blend-saturation ">
          <div className="text-[#A4A4A4] text-opacity-90 font-bold  border-b-[#393C49] mt-3 pb-2  border-b-2    flex justify-between w-full">
            <button>For You</button>{" "}
            <button className="cursor-not-allowed">Following</button>{" "}
            <button className="cursor-not-allowed">Tranding</button>{" "}
            <button className="cursor-not-allowed">Channels</button>
          </div>{" "}
        </div>
        <div className="flex flex-col space-y-7">
          {allPosts && Object.keys(allPosts).length > 0 ? (
            allPosts.map((item, index) => (
              <div key={index}>
                <PostCard item={item} />
                
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Featured;
