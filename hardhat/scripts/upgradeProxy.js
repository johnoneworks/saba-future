const { ethers, upgrades } = require('hardhat');
const { PROXY_ADDRESS, UPGRADING_CONTRACT } = process.env;

async function main() {
  const PredictionWorld = await ethers.getContractFactory(UPGRADING_CONTRACT);
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, PredictionWorld);
  
  // The addres always get the elder one.
  // You have to get the address from the PolygonScan by the Proxy address.
  // const implementationAddress = await upgrades.erc1967.getImplementationAddress(
  //   PROXY_ADDRESS
  // );

  console.log('The current contract owner is: ' + await upgraded.owner());
  console.log('Implementation contract: ' + UPGRADING_CONTRACT);
  // console.log('Implementation contract address: ' + implementationAddress);
}

main();

// Implementation contract address: 0x75Ad513E3177A6e96E4FCE22fa4209617BC22e9B