const fs = require('fs');
const { ethers } = require('ethers');
const Web3 = require('web3');

const configFile = '../Contracts/artifacts/contracts/KVstore.sol/KVstore.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

const contractABI = config.abi;
//const contractAddress = '0xdf620CBD13dC0Ac03B1eC33B49c13AB2135D8c92'; // Testnet
const contractAddress = '0xb601b6b5D08D3C8043A5E6ac4c7C941190ba7288'; // Testbed
//const contractAddress = '0x6E90DB47781e0F0278132E3bB50A641245C14B69'; // Ganache
//const privateKey = '8cab27cd055ead07ca5389b8a991076d6751bba2fcef95b1631f29c1b1ba2daa';
const privateKey = '4c149efee3f3020f72f1d389b6266bf1b3771f521f602466366175cf702d0e96'; // Ganache
//const provider = new Web3.providers.HttpProvider('https://api.metadium.com/dev');
const provider = new Web3.providers.HttpProvider('http://106.240.238.226:10188');
//const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const express = require('express');
const bodyParser = require('body-parser');
const { functionsIn } = require('lodash');

const app = express();
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(contractABI, contractAddress);
const wallet = new ethers.Wallet(privateKey, provider);

app.use(bodyParser.json());

// Example API endpoint to get a value from the contract
app.get('/get/:key', async (req, res) => {
  const key = req.params.key;
  try {
    const value = await contract.methods.get(key).call();
    res.json({ key, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get value from the contract.' });
  }
});

// Example API endpoint to set a value in the contract
app.post('/set', async (req, res) => {
  const { key, value } = req.body;
  console.log('key:', key, ', value:', value);
  console.log('from:', wallet.address);
  const setFunc = contract.methods.set(key, value);
  const txCount = await web3.eth.getTransactionCount(wallet.address);
  console.log('txCount:', txCount);
  const txObj = {
      nonce: web3.utils.toHex(txCount),
      from: wallet.address,
      to: contractAddress,
      data: setFunc.encodeABI(),
      gas: await setFunc.estimateGas(), 
      gasPrice: web3.utils.toHex(web3.utils.toWei('80', 'gwei'))
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
  web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .then(transaction => {
      console.log('Transaction Hash:', transaction.transactionHash);
      res.json({ key, value });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to set value in the contract.' });

    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

