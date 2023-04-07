const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

describe("Prediction", function () {
    describe("Deployment", function () {
        it("Should create a prediction when provided with valid params", async function() {
            const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
            const lastMarketOperationTime = (await time.latest()) + ONE_DAY_IN_SECS;
            const resolveTime = lastMarketOperationTime + ONE_DAY_IN_SECS;
            const description = "This is a test prediction";

            const Prediction = await ethers.getContractFactory("Prediction");
            const prediction = await Prediction.deploy(
                lastMarketOperationTime,
                resolveTime,
                description 
            );
            expect(prediction).to.be.an("object");
        });

        it("Should revert when resolve time is before the creation time", async function() {
            const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
            const lastMarketOperationTime = (await time.latest()) + ONE_DAY_IN_SECS;
            const resolveTime = lastMarketOperationTime - ONE_DAY_IN_SECS;
            const description = "This is a test prediction";
            const Prediction = await ethers.getContractFactory("Prediction");
            await expect(Prediction.deploy(
                lastMarketOperationTime,
                resolveTime,
                description 
            )).to.be.revertedWith("Prediction resolve time should be in the future");
        });

        it("Should revert when market operation time is before the creation time", async function() {
            const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
            const lastMarketOperationTime = (await time.latest()) - ONE_DAY_IN_SECS;
            const resolveTime = (await time.latest()) + ONE_DAY_IN_SECS;
            const description = "This is a test prediction";
            const Prediction = await ethers.getContractFactory("Prediction");
            await expect(Prediction.deploy(
                lastMarketOperationTime,
                resolveTime,
                description 
            )).to.be.revertedWith("Market operation time should be in the future");
        });

        it("Should revert when market operation time is after the resolve time", async function() {
            const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
            const lastMarketOperationTime = (await time.latest()) + ONE_DAY_IN_SECS * 2;
            const resolveTime = (await time.latest()) + ONE_DAY_IN_SECS;
            const description = "This is a test prediction";
            const Prediction = await ethers.getContractFactory("Prediction");
            await expect(Prediction.deploy(
                lastMarketOperationTime,
                resolveTime,
                description 
            )).to.be.revertedWith("No market operations after resolving");
        });
    });

    async function deployValidPrediction() {
        const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
        const lastMarketOperationTime = (await time.latest()) + ONE_DAY_IN_SECS;
        const resolveTime = lastMarketOperationTime + ONE_DAY_IN_SECS;
        const description = "This is a test prediction";

        const Prediction = await ethers.getContractFactory("Prediction");
        const prediction = await Prediction.deploy(
            lastMarketOperationTime,
            resolveTime,
            description 
        );
        return { prediction };
    }

    describe("CreateMarket", function() {

    });
    /**
     *   // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }
     */
});