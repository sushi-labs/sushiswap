import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'

import { defaultConfig, EXPORT_TASK } from '@sushiswap/hardhat-config'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'
import { HardhatUserConfig, subtask } from 'hardhat/config'
import path from 'path'

EXPORT_TASK()

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async ({ solcVersion }: { solcVersion: string }, hre, runSuper) => {
  if (solcVersion === '0.6.12') {
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
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ...defaultConfig,
}

export default config
