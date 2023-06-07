const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Test KVstore", function () {
   
  let kvstore;

  before(async () => {
    // Contracts are deployed using the first signer/account by default
    const accounts = await ethers.getSigners();

    const KVstore = await ethers.getContractFactory("KVstore", accounts[0]);
    kvstore = await KVstore.deploy();
    await kvstore.deployed();
    console.log('KVstore @ ', kvstore.address);
  });

  describe("KVstore", function () {
    it("Should store the key and value", async function () {
      await kvstore.set("1", "one");
      const retVal = await kvstore.get("1");
      expect(await kvstore.get("1")).to.equal("one");
    });
  });
});
