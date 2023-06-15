const { ethers, upgrades } = require('hardhat');
const { SURE_TOKEN_ADDRESS } = process.env;

async function main() {

  const numOfEarlyBirdsAllowed = 100;
  const amountOfTokenForEarlyBird = 1000;
  
  const initialContract = "PredictionWorld4";
  const PredictionWorld = await ethers.getContractFactory(initialContract);
  const proxy = await upgrades.deployProxy(PredictionWorld, [SURE_TOKEN_ADDRESS, numOfEarlyBirdsAllowed, amountOfTokenForEarlyBird]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );
  
  console.log(`             Sure Token: ${SURE_TOKEN_ADDRESS}`);
  console.log(`          Contract Name: ${initialContract}`);
  console.log(`         Proxy Contract: ${proxy.address}`);
  console.log(`Implementation Contract: ${implementationAddress}`);
}

main();
