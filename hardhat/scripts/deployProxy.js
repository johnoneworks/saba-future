const { ethers, upgrades } = require('hardhat');
const { SURE_TOKEN_ADDRESS } = process.env;

async function main() {

  const numOfEarlyBirdsAllowed = 100;
  const amountOfTokenForEarlyBird = 1000;
  console.log(`SURE_TOKEN_ADDRESS: ${SURE_TOKEN_ADDRESS}`);
  
  const PredictionWorld = await ethers.getContractFactory("PredictionWorld4");
  const proxy = await upgrades.deployProxy(PredictionWorld, [SURE_TOKEN_ADDRESS, numOfEarlyBirdsAllowed, amountOfTokenForEarlyBird]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );
  
  console.log('Proxy contract address: ' + proxy.address);

  console.log('Implementation contract address: ' + implementationAddress);
}

main();
