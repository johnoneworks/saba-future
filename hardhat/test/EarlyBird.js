const { upgrades } = require('hardhat');
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

describe("EarlyBird", function () {

  const earlyBirdLimit = 3;
  const earlyBirdTokenValue = ethers.BigNumber.from(1000);
  const earlyBirdTokenTotal = ethers.BigNumber.from(earlyBirdLimit * earlyBirdTokenValue);

  async function deployEarlyBirdFixture() {
    const [owner, other1, other2, other3, other4] = await ethers.getSigners();
    const SureToken = await ethers.getContractFactory("SureToken3");
    const sureToken = await SureToken.deploy();
    const decimals = await sureToken.decimals()

    const EarlyBird = await ethers.getContractFactory("EarlyBirdV1");
    const earlyBird = await upgrades.deployProxy(EarlyBird, [earlyBirdLimit, earlyBirdTokenValue]);
    await earlyBird.deployed();

    await sureToken.transfer(earlyBird.address, earlyBirdTokenTotal);

    return { earlyBird, sureToken, owner, other1, other2, other3, other4, decimals };
  }

  describe("Main", function () {

    it("Should get Sure tokens if you are early bird", async function () {

      const { earlyBird, sureToken, other1, other2, other3, other4, decimals } = await loadFixture(deployEarlyBirdFixture);

      // It should approve the allowance first.
      const other1TokenContract = sureToken.connect(other1);
      await other1TokenContract.approve(earlyBird.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));
      const other2TokenContract = sureToken.connect(other2);
      await other2TokenContract.approve(earlyBird.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));
      const other3TokenContract = sureToken.connect(other3);
      await other3TokenContract.approve(earlyBird.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));
      const other4TokenContract = sureToken.connect(other4);
      await other4TokenContract.approve(earlyBird.address, ethers.utils.parseUnits(earlyBirdTokenValue.toString(), decimals));

      const other1EarlyBirdContract = earlyBird.connect(other1);
      expect(await sureToken.balanceOf(other1.address)).is.equal(0);

      // Validate the first. Should be valid with 1.
      expect(await other1EarlyBirdContract.validate(other1.address)).is.equal(1);

      // The first snap up the early bird tokens.
      await other1EarlyBirdContract.snapUp(sureToken.address);
      expect(await sureToken.balanceOf(other1.address)).is.equal(earlyBirdTokenValue);

      // Validate the first. Should be invalid with Error: 3.
      expect(await other1EarlyBirdContract.validate(other1.address)).is.equal(3);

      // Could not get the token again.
      await expect(other1EarlyBirdContract.snapUp(sureToken.address))
        .to.be.revertedWithCustomError(other1EarlyBirdContract, "AlreadyExists");

      // The second snap up the early bird tokens.
      const other2EarlyBirdContract = earlyBird.connect(other2);
      expect(await sureToken.balanceOf(other2.address)).is.equal(0);
      await other2EarlyBirdContract.snapUp(sureToken.address);
      expect(await sureToken.balanceOf(other2.address)).is.equal(earlyBirdTokenValue);

      // The third snap up the early bird tokens.
      const other3EarlyBirdContract = earlyBird.connect(other3);
      await other3EarlyBirdContract.snapUp(sureToken.address);
      expect(await sureToken.balanceOf(other3.address)).is.equal(earlyBirdTokenValue);

      // The fourth snap up but it's sold out.
      const other4EarlyBirdContract = earlyBird.connect(other4);
      await expect(other4EarlyBirdContract.snapUp(sureToken.address))
        .to.be.revertedWithCustomError(other4EarlyBirdContract, "AllOccupied");

      // Validate the fourth. Should be invalid with Error 2.
      expect(await other4EarlyBirdContract.validate(other4.address)).is.equal(2);

    });
  });
});