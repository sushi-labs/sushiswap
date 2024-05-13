import '@nomiclabs/hardhat-ethers'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { HardhatUserConfig } from 'hardhat/config'

const _accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    'test test test test test test test test test test test junk',
  accountsBalance: '10000000000000000000000000',
}

const config: HardhatUserConfig = {
  ...defaultConfig,
  networks: {
    ...defaultConfig.networks,
    // hardhat: {
    //   forking: {
    //     enabled: true,
    //     url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    //     blockNumber: 18526020,
    //   },
    //   accounts: {
    //     accountsBalance: '10000000000000000000000000', //(10_000_000 ETH).
    //   },
    //   chainId: 1,
    //   blockGasLimit: 1_000_000_000
    // },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: process.env.ALCHEMY_ID
          ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
          : 'https://polygon-mainnet.g.alchemy.com/v2/demo',
        blockNumber: 56000000,
      },
      accounts: {
        accountsBalance: '10000000000000000000000000', //(10_000_000 MATIC).
      },
      chainId: 137,
      blockGasLimit: 1_000_000_000,
    },
    // hardhat: {
    //   forking: {
    //     enabled: process.env.FORKING === 'true',
    //     url: `https://lb.drpc.org/ogrpc?network=base&dkey=${process.env.DRPC_ID}`,
    //     blockNumber: 3033333,
    //   },
    //   accounts: {
    //     accountsBalance: '10000000000000000000000000', //(10_000_000 BASE).
    //   },
    //   chainId: 8453,
    // },
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
