import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { readFileSync, symlinkSync, writeFileSync } from 'fs'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'
import { HardhatUserConfig, subtask, task } from 'hardhat/config'
import { TASK_EXPORT } from 'hardhat-deploy'
import path from 'path'

task(TASK_EXPORT, async (args, hre, runSuper) => {
  await runSuper()

  const exports = readFileSync('./exports.json', { encoding: 'utf-8' })
  writeFileSync('./exports.ts', `export default ${exports} as const`)
  symlinkSync('./exports.ts', './exports.cts')
})

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async ({ solcVersion }: { solcVersion: string }, hre, runSuper) => {
  if (solcVersion === '0.8.11') {
    const compilerPath = path.join(__dirname, 'soljson-v0.8.11+commit.d7f03943.js')
    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: '0.8.11+commit.d7f03943',
    }
  }
  return runSuper()
})

// task('approve', 'Approve to router').setAction(async function (_, { ethers, getChainId }) {
//   const chainId = Number(await getChainId())
//   const contract = await ethers.getContract('SushiXSwap')

//   for (const token of STARGATE_BRIDGE_TOKENS[chainId]) {
//     try {
//       await contract.approveToStargateRouter(token.address)
//     } catch (error) {
//       console.log(error)
//     }
//   }
// })

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  ...defaultConfig,
  // Forces redeployment for some reason...
  // external: {
  //   contracts: [
  //     {
  //       artifacts: 'node_modules/@sushiswap/bentobox/artifacts',
  //       deploy: 'node_modules/@sushiswap/bentobox/deploy',
  //     },
  //   ],
  // },
  // networks: {
  //   ethereum: {
  //     url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
  //     live: true,
  //     chainId: 1,
  //     saveDeployments: true,
  //     tags: ['mainnet'],
  //     hardfork: process.env.CODE_COVERAGE ? 'berlin' : 'london',
  //   },
  // },
  // mocha: {
  //   timeout: 3_600_000,
  // },
}

export default config
