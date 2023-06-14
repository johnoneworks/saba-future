const { ethers, upgrades } = require('hardhat');
const { PROXY_ADDRESS, UPGRADING_CONTRACT } = process.env;

async function main() {
  const PredictionWorld = await ethers.getContractFactory(UPGRADING_CONTRACT);
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, PredictionWorld);
  await upgraded.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    PROXY_ADDRESS
  );

  console.log('                  Owner: ' + await upgraded.owner());
  console.log('          Contract Name: ' + UPGRADING_CONTRACT);
  console.log('         Proxy Contract: ' + PROXY_ADDRESS);
  console.log('Implementation Contract: ' + implementationAddress);
}

main();
