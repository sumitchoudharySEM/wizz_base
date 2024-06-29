import React from "react";

const CreateJob = () => {
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
          type="text"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Job Title"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <input
          type="text"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Short Description: Provide a brief overview"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <select
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
          type="number"
          min="0"
          className="appearance-none block w-full bg-[#34374D] text-white rounded-xl py-4 px-4 m-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Reward (USD)"
        />
      </div>

      <div className="flex md:flex-row flex-col">
        <textarea
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
          <button className="bg-[#7501E9] py-3 w-[90%] text-white border-none rounded-xl">
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
