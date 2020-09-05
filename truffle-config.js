'use strict';

var HDWalletProvider = require("@truffle/hdwallet-provider")

const isCoverage = process.env.COVERAGE === 'true'

module.exports = {
  networks: {
    // development: {
    //   host: 'localhost',
    //   port: 7545,
    //   gas: 12000000,
    //   gasPrice: 1 * 1000000000,
    //   network_id: '5777'
    // },

    local: {
      host: 'localhost',
      port: 8545,
      gas: 6999999,
      gasPrice: 1 * 1000000000,
      network_id: '*'
    },

    rinkeby: {
      provider: function() {
        const mnemonic = 'lumber choice thing skull allow favorite light horse gun media treat peasant'
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/0865b420656e4d70bcbbcc76e265fd57')
      },
      network_id: 4,
      skipDryRun: true,
      networkCheckTimeout: 10000,
      gas: 4612388  // Gas limit used for deploys
    },

    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.HDWALLET_MNEMONIC,
        process.env.INFURA_PROVIDER_URL_MAINNET,
        0,
        3
      ),
      skipDryRun: true,
      network_id: 1,
      gas: 7000000,
      gasPrice: 3.01 * 1000000000
    },

    kovan: {
      provider: () => new HDWalletProvider(
        process.env.HDWALLET_MNEMONIC,
        process.env.INFURA_PROVIDER_URL_KOVAN,
        0,
        3
      ),
      skipDryRun: true,
      network_id: 42
    },

    mainnet_fork: {
      provider: () => new HDWalletProvider(
        process.env.HDWALLET_MNEMONIC,
        process.env.LOCALHOST_URL,
        0,
        3
      ),
      gas: 7000000,
      network_id: 999
      // gasPrice: 11.101 * 1000000000
    }
  },

  plugins: ["solidity-coverage"],

  compilers: {
    solc: {
      version: "0.6.12",
      docker: false,
      settings: {
        evmVersion: 'constantinpole'
      }
    }
  },

  // optimization breaks code coverage
  solc: {
    optimizer: {
      enabled: !isCoverage,
      runs: 200
    }
  },

  mocha: isCoverage ? {
    reporter: 'mocha-junit-reporter',
  } : {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 200
    }
  }
};