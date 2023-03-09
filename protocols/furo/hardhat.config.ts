import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'

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
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  // external: {
  //   contracts: [
  //     {
  //       artifacts: 'node_modules/@sushiswap/bentobox/artifacts',
  //       deploy: 'node_modules/@sushiswap/bentobox/deploy',
  //     },
  //   ],
  // },
  // namedAccounts: {
  //   deployer: {
  //     default: 4,
  //   },
  // },
}

export default config
