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
    IProfileContract public profileContract; 
    uint256 public jobCount;
    uint256 public applicationCount;

    struct Job {
        uint256 jobId;
        string title;
        string shortDescription;
        string descriptionIPFS; 
        address employer;
        string employerUsername;
        uint256 reward; 
        string status; 
        string jobType;
        uint256 timestamp; 
        string[] applicantsUsername; 
    }

    struct Application {
        uint256 applicationId;
        uint256 jobId;
        address applicant;
        string applicantUsername;
        string applicationIPFS; 
        string status; 
        uint256 timestamp; 
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

    function updateJobStatus(uint256 _jobId, string memory _status) external {
        Job storage job = jobs[_jobId];
        require(job.jobId != 0, "Job does not exist");
        require(job.employer == msg.sender, "Only the employer can update the job status");

        job.status = _status;
    }

    function updateApplicationStatus(uint256 _applicationId, string memory _status) external {
        Application storage application = applications[_applicationId];
        require(application.applicationId != 0, "Application does not exist");
        Job storage job = jobs[application.jobId];
        require(job.jobId != 0, "Associated job does not exist");
        require(job.employer == msg.sender, "Only the employer can update the application status");

        application.status = _status;
    }

    function getJobsByEmployer(string memory _employerUsername) external view returns (uint256[] memory) {
        return employerJobs[_employerUsername];
    }

    function getApplicationsByApplicant(string memory _applicantUsername) external view returns (uint256[] memory) {
        return applicantApplications[_applicantUsername];
    }

    function getJobByJobID(uint256 _jobid)
        external
        view
        returns (Job memory)
    {
        return jobs[_jobid];
    }

     function getAllJobs() external view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCount);
        for (uint256 i = 1; i <= jobCount; i++) {
            Job storage job = jobs[i];
            allJobs[i-1] = Job({
                jobId: job.jobId,
                title: job.title,
                shortDescription: job.shortDescription,
                descriptionIPFS: job.descriptionIPFS,
                employer: job.employer,
                employerUsername: job.employerUsername,
                reward: job.reward,
                status: job.status,
                jobType: job.jobType,
                timestamp: job.timestamp,
                applicantsUsername: new string[](0x0)
            });
        }
        return allJobs;
    }

    function setProfileContractAddress(address _profileContractAddress) external {
        require(msg.sender == Owner, "Only the owner can set the profile contract address");
        profileContract = IProfileContract(_profileContractAddress);
    }
}