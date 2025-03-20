import { expect } from "chai";
import { ethers } from "hardhat";
import { Freelance } from "../typechain-types"; // Import the generated type

describe("FreelancerRegistration", function () {

  const name = "John Doe";
  const skills = "Web Development";
  const country = "USA";
  const gigTitle = "Build a Website";
  const gigDesc = "I will build a responsive website for your business.";
  const images = ["image1.png", "image2.png"];
  const startingPrice = ethers.parseEther("0.1");


  let freelancerContract: Freelance;
  let employer;
  let freelancer;

  beforeEach(async function () {
    // Deploy the contract
    const FreelancerContract = await ethers.getContractFactory("Freelance");
    freelancerContract = (await FreelancerContract.deploy()) as unknown as Freelance
    await freelancerContract.waitForDeployment();

    // Get signers
    [employer, freelancer] = await ethers.getSigners();
  });

  it("Should register a freelancer successfully", async function () {


    // Get the freelancer's address
    const freelancerAddress = await freelancer.getAddress();

    //  Test: Register the freelancer
    await expect(
      freelancerContract
        .connect(freelancer)
        .registerFreelancer(name, skills, country, gigTitle, gigDesc, images, startingPrice)
    )
      .to.emit(freelancerContract, "FreelancerRegistered")
      .withArgs(freelancerAddress, images, startingPrice);

    // Check if the freelancer is registered
    const freelancerInfo = await freelancerContract.freelancers(freelancerAddress);
    expect(freelancerInfo.registered).to.be.true;
    expect(freelancerInfo.name).to.equal(name);
    expect(freelancerInfo.skills).to.equal(skills);
    expect(freelancerInfo.country).to.equal(country);
    expect(freelancerInfo.gigTitle).to.equal(gigTitle);
  });

  // Test: Creating a job
  it("Should create a job", async function () {
    await freelancerContract
      .connect(employer)
      .registerEmployer("Ahmod", "technology", "United States", "https://img.com");
    await freelancerContract
      .connect(employer)
      .createJob(gigTitle, gigDesc, startingPrice);

    const job = await freelancerContract.getJobByID("1");
    expect(job.employer).to.equal(await employer.getAddress());
    expect(job.title).to.equal(gigTitle);
    expect(job.description).to.equal(gigDesc);
    expect(job.budget).to.equal(startingPrice);
    expect(job.completed).to.be.false;
  });

  // Test: Hiring a freelancer
  it("Should hire a freelancer", async function () {
    await freelancerContract
    .connect(employer)
    .registerEmployer("Ahmod", "technology", "United States", "https://img.com");
  await freelancerContract
    .connect(employer)
    .createJob(gigTitle, gigDesc, startingPrice);

    await freelancerContract.connect(freelancer).applyForJob("1");
    await freelancerContract.connect(employer).hireFreelancer("1", await freelancer.getAddress());

    const job = await freelancerContract.getJobByID("1");
    expect(job.hiredFreelancer).to.equal(await freelancer.getAddress());
  });

  // Test: Depositing funds by employer
  it("Should deposit funds to a job", async function () {

    await freelancerContract
    .connect(employer)
    .registerEmployer("Ahmod", "technology", "United States", "https://img.com");
  await freelancerContract
    .connect(employer)
    .createJob(gigTitle, gigDesc, startingPrice);
    
    const fund = "100";
    await freelancerContract
      .connect(employer)
      .depositFunds("1", { value: ethers.parseEther(fund) });

    const escrowFund = await freelancerContract.getEmployerEscrow(await employer.getAddress(), "1");
    const _employer = await freelancerContract.getEmployerByAddress(await employer.getAddress());
    expect(_employer.balance).to.equal(ethers.parseEther(fund));
    expect(escrowFund).to.equal(ethers.parseEther(fund));
  });

});