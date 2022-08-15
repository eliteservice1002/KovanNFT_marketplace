require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const projectId = "3c8e7f53bc6442a1876c4dc03e0a1f32";
const privateKey = fs.readFileSync('./.secret').toString();
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337, //ethereum
      // chainId: 97, //ethereum
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/${projectId}",
      accounts: [privateKey],
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/${projectId}",
      accounts: [privateKey],
    },
    kovan: {
      url: "https://kovan.infura.io/v3/3c8e7f53bc6442a1876c4dc03e0a1f32",
      accounts: [privateKey],
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      accounts: [privateKey],
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.4.17",
        settings: {},
      },
    ],
  },
};
