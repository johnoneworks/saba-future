const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

describe("earlyBirdDiscount", function () {

  const earlyBirdLimit = 2;
  const earlyBirdTokenValue = ethers.BigNumber.from(1000);

  async function deploySurePredictionWorldFixture() {
    const [owner, other1, other2, other3] = await ethers.getSigners();
    const SureToken = await ethers.getContractFactory("SureToken3");
    const sureToken = await SureToken.deploy();
    const decimals = await sureToken.decimals()

    const PredictionWorld = await ethers.getContractFactory("PredictionWorld3");
    const predictionWorld = await PredictionWorld.deploy(sureToken.address, earlyBirdLimit, earlyBirdTokenValue);
    
    return { predictionWorld, sureToken, owner, other1, other2, other3, decimals };
  }

  const dummyMarket1 = {
    question: "Can I win the lottery?",
    creatorImageHash: "data:image/jpeg;base64,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",
    description: "Strong Luck",
    resolverUrl: "https://resolverUrl",
    endTimestamp: Date.now(),
  };

  describe("Early Bird", function () {

    it("Should get SURE when first play", async function () {

      const { predictionWorld, sureToken, other1, other2, other3, decimals } = await loadFixture(deploySurePredictionWorldFixture);

      const earlyBirdTokenTotal = ethers.BigNumber.from(earlyBirdLimit * earlyBirdTokenValue);
      await sureToken.transfer(predictionWorld.address, earlyBirdTokenTotal);

      const value = await sureToken.balanceOf(predictionWorld.address);

      // Create a market1
      await predictionWorld.createMarket(
        dummyMarket1.question,
        dummyMarket1.creatorImageHash,
        dummyMarket1.description,
        dummyMarket1.resolverUrl,
        dummyMarket1.endTimestamp
      );

      // It should approve the allowance first.
      const other1TokenContract = sureToken.connect(other1);
      await other1TokenContract.approve(predictionWorld.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));
      const other2TokenContract = sureToken.connect(other2);
      await other2TokenContract.approve(predictionWorld.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));
      const other3TokenContract = sureToken.connect(other3);
      await other3TokenContract.approve(predictionWorld.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));

      const other1PredictionContract = predictionWorld.connect(other1);
      expect(await sureToken.balanceOf(other1.address)).is.equal(0);
      const firstValue = ethers.BigNumber.from(300);

      // First play, should get the early bird tokens.
      await other1PredictionContract.addYesBet(0, firstValue);
      expect(await sureToken.balanceOf(other1.address)).is.equal(earlyBirdTokenValue.sub(firstValue));
     
      // Could not get the token again.
      // And have the enough token to play again.
      await other1PredictionContract.addYesBet(0, firstValue);
      expect(await sureToken.balanceOf(other1.address)).is.equal(earlyBirdTokenValue.sub(firstValue.mul(2)));
     
      // Should revert when play with too much.
      await expect(other1PredictionContract.addYesBet(0, earlyBirdTokenValue)).to.be.revertedWith("ERC20: transfer amount exceeds balance");;
      
      const other2PredictionContract = predictionWorld.connect(other2);
      expect(await sureToken.balanceOf(other2.address)).is.equal(0);
      await other2PredictionContract.addYesBet(0, firstValue);
      expect(await sureToken.balanceOf(other2.address)).is.equal(earlyBirdTokenValue.sub(firstValue));

      const contratTokens = earlyBirdTokenTotal
        .sub(earlyBirdTokenValue)
        .add(firstValue)
        .add(firstValue)
        .sub(earlyBirdTokenValue)
        .add(firstValue);
      expect(await sureToken.balanceOf(predictionWorld.address)).is.equal(contratTokens);

      const other3PredictionContract = predictionWorld.connect(other3);
      await expect(other3PredictionContract.addNoBet(0, firstValue)).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    });
    
  });

});