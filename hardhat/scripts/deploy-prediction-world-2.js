// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const SureToken2 = await hre.ethers.getContractFactory("SureToken2");
  const sureToken2 = await SureToken2.deploy();
  await sureToken2.deployed();

  console.log(`SURE Token(2) contract deployed to ${sureToken2.address}`);

  const PredictionWorld2 = await hre.ethers.getContractFactory("PredictionWorld2");
  const predictionWorld2 = await PredictionWorld2.deploy(sureToken2.address);
  await predictionWorld2.deployed();
  console.log(`PredictionWorld(2) contract deployed to ${predictionWorld2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
