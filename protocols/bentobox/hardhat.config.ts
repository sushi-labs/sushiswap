import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { readFileSync, writeFileSync } from 'fs'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'
import { HardhatUserConfig, subtask, task } from 'hardhat/config'
import { TASK_EXPORT } from 'hardhat-deploy'
import path from 'path'

task(TASK_EXPORT, async (args, hre, runSuper) => {
  await runSuper()

  const parsed = JSON.parse(readFileSync('./exports.json', { encoding: 'utf-8' }))

  delete parsed['31337']

  const string = JSON.stringify(parsed)

  writeFileSync(
    './exports.ts',
    `
export const bentoBoxExports = ${string} as const
export type BentoBoxExports = typeof bentoBoxExports
export type BentoBoxExport = BentoBoxExports[keyof typeof bentoBoxExports][number]
export type BentoBoxChainId = BentoBoxExport['chainId']
export type BentoBoxContracts = BentoBoxExport['contracts']
export type BentoBoxContractName = keyof BentoBoxContracts
export type BentoBoxContract = BentoBoxContracts[BentoBoxContractName]
export const bentoBoxAddress = Object.fromEntries(
  Object.entries(bentoBoxExports)
  .map(([chainId, data]) => [parseInt(chainId), data[0].contracts.BentoBoxV1.address])
  ) as {
    [chainId in BentoBoxChainId]: BentoBoxExports[chainId][number]['contracts'][BentoBoxContractName]['address']
  }
export default bentoBoxExports
  `
  )
})

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
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 256,
      },
    },
  },
  ...defaultConfig,
}

export default config
