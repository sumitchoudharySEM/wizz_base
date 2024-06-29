// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

interface IProfileContract {
    function getUsernameByAddress(address _userAddress)
        external
        view
        returns (string memory);
}

contract JobMarketplaceContract {
    address public Owner;
    IProfileContract public profileContract; // Reference to the ProfileContract
    uint256 public jobCount;
    uint256 public applicationCount;

    struct Job {
        uint256 jobId;
        string title;
        string shortDescription;
        string descriptionIPFS; // IPFS hash for detailed job description
        address employer;
        string employerUsername;
        uint256 reward; // Reward in wei
        string status; // E.g., "Open", "Closed", "Completed"
        string jobType; // Type of job: "Freelancing", "Bounty", "Internship", etc.
        uint256 timestamp; // Timestamp when the job was created
        string[] applicantsUsername; // Usernames of applicants
    }

    struct Application {
        uint256 applicationId;
        uint256 jobId;
        address applicant;
        string applicantUsername;
        string applicationIPFS; // IPFS hash for application details
        string status; // E.g., "Submitted", "Accepted", "Rejected"
        uint256 timestamp; // Timestamp when the application was submitted
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Application) public applications;
    mapping(string => uint256[]) public employerJobs; // Maps employer username to job IDs
    mapping(string => uint256[]) public applicantApplications; // Maps applicant username to application IDs

    event JobCreated(uint256 jobId, string title, address indexed employer, uint256 reward);
    event ApplicationSubmitted(uint256 applicationId, uint256 jobId, address indexed applicant);

    constructor(address _profileContractAddress) {
        Owner = msg.sender;
        profileContract = IProfileContract(_profileContractAddress);
        jobCount = 0;
        applicationCount = 0;
    }

    // Function to create a job
    function createJob(
        string memory _title,
        string memory _shortDescription,
        string memory _descriptionIPFS,
        uint256 _reward,
        string memory _jobType
    ) external {
        string memory employerUsername = profileContract.getUsernameByAddress(msg.sender);
        require(bytes(employerUsername).length != 0, "Employer must have a username");

        jobCount++;
        jobs[jobCount] = Job({
            jobId: jobCount,
            title: _title,
            shortDescription: _shortDescription,
            descriptionIPFS: _descriptionIPFS,
            employer: msg.sender,
            employerUsername: employerUsername,
            reward: _reward,
            status: "Open",
            jobType: _jobType,
            timestamp: block.timestamp,
            applicantsUsername: new string[](0x0) 
        });

        employerJobs[employerUsername].push(jobCount);

        emit JobCreated(jobCount, _title, msg.sender, _reward);
    }

    // Function to apply for a job
    function applyForJob(uint256 _jobId, string memory _applicationIPFS) external {
        Job storage job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        require(keccak256(bytes(job.status)) == keccak256(bytes("Open")), "Job is not open for applications");

        string memory applicantUsername = profileContract.getUsernameByAddress(msg.sender);
        require(bytes(applicantUsername).length != 0, "Applicant must have a username");

        applicationCount++;
        applications[applicationCount] = Application({
            applicationId: applicationCount,
            jobId: _jobId,
            applicant: msg.sender,
            applicantUsername: applicantUsername,
            applicationIPFS: _applicationIPFS,
            status: "Submitted",
            timestamp: block.timestamp
        });

        job.applicantsUsername.push(applicantUsername);
        applicantApplications[applicantUsername].push(applicationCount);

        emit ApplicationSubmitted(applicationCount, _jobId, msg.sender);
    }

    // Function to update job status
    function updateJobStatus(uint256 _jobId, string memory _status) external {
        Job storage job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        require(job.employer == msg.sender, "Only the employer can update the job status");

        job.status = _status;
    }

    // Function to update application status
    function updateApplicationStatus(uint256 _applicationId, string memory _status) external {
        Application storage application = applications[_applicationId];
        require(application.applicationId != 0, "Application does not exist");
        Job storage job = jobs[application.jobId];
        require(job.jobId != 0, "Associated job does not exist");
        require(job.employer == msg.sender, "Only the employer can update the application status");

        application.status = _status;
    }

    // Function to get all jobs created by an employer
    function getJobsByEmployer(string memory _employerUsername) external view returns (uint256[] memory) {
        return employerJobs[_employerUsername];
    }

    // Function to get all applications submitted by an applicant
    function getApplicationsByApplicant(string memory _applicantUsername) external view returns (uint256[] memory) {
        return applicantApplications[_applicantUsername];
    }

    // Function to set the profile contract address (only Owner)
    function setProfileContractAddress(address _profileContractAddress) external {
        require(msg.sender == Owner, "Only the owner can set the profile contract address");
        profileContract = IProfileContract(_profileContractAddress);
    }
}