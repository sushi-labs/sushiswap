import '@nomiclabs/hardhat-ethers'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  ...defaultConfig,
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      // ethereum
      forking: {
        enabled: true,
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
        blockNumber: 19138000,
      },
      accounts: [
        {
          privateKey:
            '0x0102030405060708091011121314151601020304050607080910111213141516',
          balance: '10000000000000000000000000', //(10_000_000 ETH).
        },
      ],
      chainId: 1,
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
    timeout: 24 * 3600_000,
  },
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default config
