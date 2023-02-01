/* eslint-disable turbo/no-undeclared-env-vars */
import '@nomiclabs/hardhat-ethers'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { readFileSync, writeFileSync } from 'fs'
import { HardhatUserConfig, task } from 'hardhat/config'
import { TASK_EXPORT } from 'hardhat-deploy'

task(TASK_EXPORT, async (args, hre, runSuper) => {
  await runSuper()

  const exports = readFileSync('./exports.json', { encoding: 'utf-8' })
  writeFileSync('./exports.ts', `export default ${exports} as const`)
})

const config: HardhatUserConfig = {
  ...defaultConfig,
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
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
