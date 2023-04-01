/* eslint-disable turbo/no-undeclared-env-vars */
import '@nomiclabs/hardhat-ethers'

import { defaultConfig, EXPORT_TASK } from '@sushiswap/hardhat-config'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'
import { HardhatUserConfig, subtask } from 'hardhat/config'
import path from 'path'

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
  } else if (solcVersion === '0.7.6') {
    const compilerPath = path.join(__dirname, 'soljson-v0.7.6+commit.7338295f')
    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: 'soljson-v0.7.6+commit.7338295f',
    }
  }
  // we just use the default subtask if the version is not 0.8.5
  return runSuper()
})

const config: HardhatUserConfig = {
  ...defaultConfig,
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      // ethereum
      forking: {
        enabled: true,
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 16861000,
      },
      accounts: {
        accountsBalance: '10000000000000000000000000', //(10_000_000 ETH).
      },
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
    timeout: 3600_000,
  },
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default config
