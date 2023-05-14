import '@nomiclabs/hardhat-ethers'

import { defaultConfig, EXPORT_TASK } from '@sushiswap/hardhat-config'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'
import { HardhatUserConfig, subtask } from 'hardhat/config'
import path from 'path'

const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
  accountsBalance: '10000000000000000000000000',
}

EXPORT_TASK()

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async ({ solcVersion }: { solcVersion: string }, hre, runSuper) => {
  if (solcVersion === '0.8.10') {
    const compilerPath = path.join(__dirname, 'soljson-v0.8.10+commit.fc410830.js')
    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: '0.8.10+commit.fc410830',
    }
  } else if (solcVersion === '0.6.12') {
    const compilerPath = path.join(__dirname, 'soljson-v0.6.12+commit.27d51765.js')
    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: '0.6.12+commit.27d51765',
    }
  }
  // we just use the default subtask if the version is not 0.8.5
  return runSuper()
})

const config: HardhatUserConfig = {
  ...defaultConfig,
  networks: {
    ...defaultConfig.networks,
    // hardhat: {
    //   forking: {
    //     enabled: true,
    //     url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    //     blockNumber: 17195000,
    //   },
    //   accounts: {
    //     accountsBalance: '10000000000000000000000000', //(10_000_000 ETH).
    //   },
    //   chainId: 1,
    // },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: process.env.ALCHEMY_ID
          ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
          : 'https://polygon-mainnet.g.alchemy.com/v2/demo',
        blockNumber: 42053000,
      },
      accounts: {
        accountsBalance: '10000000000000000000000000', //(10_000_000 MATIC).
      },
      chainId: 137,
    },
    // hardhat: {
    //   forking: {
    //     enabled: process.env.FORKING === 'true',
    //     url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    //     blockNumber: 89111000,
    //   },
    //   accounts: {
    //     accountsBalance: '10000000000000000000000000', //(10_000_000 ETH).
    //   },
    //   chainId: 42161,
    // },
    anvil_fork: {
      // install: https://github.com/foundry-rs/foundry/tree/master/anvil
      // start: anvil --fork-url https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID} --fork-block-number 42053000 --timeout 1000000000
      url: 'http://127.0.0.1:8545',
      chainId: 137,
    },
    // ethereum: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    //   accounts,
    //   chainId: 1,
    //   hardfork: process.env.CODE_COVERAGE ? 'berlin' : 'london',
    // },
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts,
    //   chainId: 3,
    // },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts,
    // },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000000,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000000,
          },
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
