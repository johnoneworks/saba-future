// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const predictionContract = await hre.ethers.getContractAt("PredictionWorld2", "0xa33984BDD910d25C9d4ad11dD50E2ba18E0Ab7FD");
  const tokenContract = await hre.ethers.getContractAt("SureToken2", "0xd63E83580bBEc586665ABBD4e1B02f8bBD6F8bE0");

  await predictionContract.addYesBet(2, 10);

  console.log(`markets[1]: ${await predictionContract.markets(1)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
SURE Token(2) contract deployed to 0xd63E83580bBEc586665ABBD4e1B02f8bBD6F8bE0
PredictionWorld(2) contract deployed to 0xa33984BDD910d25C9d4ad11dD50E2ba18E0Ab7FD
 */