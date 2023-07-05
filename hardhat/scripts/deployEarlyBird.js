const { ethers, upgrades } = require('hardhat');

async function main() {

  const numOfEarlyBirdsAllowed = 100;
  const amountOfTokenForEarlyBird = 1000;
  
  const initialContract = "EarlyBirdV1";
  const PredictionWorld = await ethers.getContractFactory(initialContract);
  const proxy = await upgrades.deployProxy(PredictionWorld, [numOfEarlyBirdsAllowed, amountOfTokenForEarlyBird]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );
  
  console.log(`      Early Bird Contract: ${initialContract}`);
  console.log(`         Early Bird Proxy: ${proxy.address}`);
  console.log(`Early Bird Implementation: ${implementationAddress}`);
}

main();
