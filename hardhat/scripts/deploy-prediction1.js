// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
  const lastMarketOperationTime = (await time.latest()) + ONE_DAY_IN_SECS;
  const resolveTime = lastMarketOperationTime + ONE_DAY_IN_SECS;
  const description = "This is a test prediction";

  const Prediction = await hre.ethers.getContractFactory("Prediction");
  const prediction = await Prediction.deploy(
      lastMarketOperationTime,
      resolveTime,
      description 
  );
  await prediction.deployed();

  console.log(`Prediction contract deployed to ${prediction.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
