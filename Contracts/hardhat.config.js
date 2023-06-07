require("@nomicfoundation/hardhat-toolbox");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const GANACHE_PRIV_KEY = "1375a8e7fa6ceb0798e2dda74817fc4aeb775999e7ac553af54fc2be0c6db842";
const PRIV_KEY = "8cab27cd055ead07ca5389b8a991076d6751bba2fcef95b1631f29c1b1ba2daa";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      url: `http://127.0.0.1:7545`,
      accounts: [`${GANACHE_PRIV_KEY}`],
      gasPrice: 20000000000
    },
    testbed: {
      url: `http://106.240.238.226:10188`,
      accounts: [`${PRIV_KEY}`],
      gasPrice: 80000000000
    },
    meta_testnet: {
      url: `https://api.metadium.com/dev`,
      accounts: [`${PRIV_KEY}`],
      gasPrice: 80000000000
    },
    wemix_testnet: {
      url: `https://api.test.wemix.com`,
      accounts: [`${PRIV_KEY}`],
      gasPrice: 100000000000
    }
  }
};
