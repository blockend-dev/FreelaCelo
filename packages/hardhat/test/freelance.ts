import { expect, assert } from 'chai';
import hre from "hardhat";
import * as ethers from "ethers";

describe('Freelance ', ()=>{

    const freelancerName = "Test Freelancer";
    const freelancerSkills = "Solidity, JavaScript";
    const freelancerCountry = 'Nigeria';
    const freelancerGigTitle = 'I will design and develop a dApp';
    const images = ['https://image.com/freelancerImage','https://image.com/gigImage'];
    const freelancerGigDesc = 'Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ';
    const starting_price = '100';

    let freelancer,employer,intermediary,dfreelancer
  

    before(async function () {
        [freelancer, employer,intermediary] = await hre.ethers.getSigners();
        
        const contractFactory = await hre.ethers.getContractFactory("Freelance");
        dfreelancer = await contractFactory.deploy();
    });

    //  registering freelancer,
    it("Should register a freelancer", async function () {
        await (dfreelancer.connect(freelancer))
        .registerFreelancer(freelancerName, freelancerSkills,freelancerCountry,
        freelancerGigTitle,freelancerGigDesc, images,starting_price);
       
        const registeredFreelancer = await dfreelancer.freelancers(freelancer.address);
        expect(registeredFreelancer.freelancerAddress).to.equal(freelancer.address);
        expect(registeredFreelancer.name).to.equal(freelancerName);
        expect(registeredFreelancer.skills).to.equal(freelancerSkills);
        expect(registeredFreelancer.balance.toString()).to.equal('0');
    });

    
});