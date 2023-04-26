// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const SureToken = await hre.ethers.getContractFactory("SureToken3");
  const sureToken = await SureToken.deploy();
  await sureToken.deployed();

  console.log(`SURE Token(3) contract deployed to ${sureToken.address}`);

  const PredictionWorld = await hre.ethers.getContractFactory("PredictionWorld3");
  const predictionWorld = await PredictionWorld.deploy(sureToken.address, 100, 1000);
  await predictionWorld.deployed();
  console.log(`PredictionWorld(3) contract deployed to ${predictionWorld.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
