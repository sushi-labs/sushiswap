/* eslint-disable turbo/no-undeclared-env-vars */
import '@nomiclabs/hardhat-ethers'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { readFileSync, writeFileSync } from 'fs'
import { HardhatUserConfig, task } from 'hardhat/config'
import { TASK_EXPORT } from 'hardhat-deploy'

const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
  accountsBalance: '10000000000000000000000000',
}

task(TASK_EXPORT, async (args, hre, runSuper) => {
  await runSuper()

  const exports = readFileSync('./exports.json', { encoding: 'utf-8' })
  writeFileSync('./exports.ts', `export default ${exports} as const`)
})

const config: HardhatUserConfig = {
  ...defaultConfig,
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {},
    hardhat: {
      // ethereum
      forking: {
        enabled: true,
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 16240100,
      },
      accounts: {
        accountsBalance: '10000000000000000000000000', //(10_000_000 ETH).
      },
      chainId: 1,
    },
    // hardhat: {
    //   // polygon
    //   forking: {
    //     enabled: true,
    //     url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    //     blockNumber: 37180000,
    //   },
    //   accounts: {
    //     accountsBalance: '10000000000000000000000000', //(10_000_000 MATIC).
    //   },
    //   chainId: 137,
    // },
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts,
      chainId: 1,
      hardfork: process.env.CODE_COVERAGE ? 'berlin' : 'london',
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        // For UniV3FactoryFlat
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
          metadata: {
            bytecodeHash: 'none',
          },
          outputSelection: {
            '*': {
              '*': ['evm.bytecode', 'evm.deployedBytecode', 'abi'],
            },
          },
          libraries: {},
        },
      },
    ],
  },
  mocha: {
    timeout: 3600_000,
  },
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default config
