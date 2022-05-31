import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import '@tenderly/hardhat-tenderly'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { HardhatUserConfig } from 'hardhat/config'
import { task } from 'hardhat/config'

task('approve', 'Approve to router').setAction(async function (_, { ethers, getChainId }) {
  const chainId = Number(await getChainId())
  const contract = await ethers.getContract('SushiXSwap')

  for (const token of STARGATE_BRIDGE_TOKENS[chainId]) {
    try {
      await contract.approveToStargateRouter(token.address)
    } catch (error) {
      console.log(error)
    }
  }
})

const config: HardhatUserConfig = {
  ...defaultConfig,
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  // Forces redeployment for some reason...
  // external: {
  //   contracts: [
  //     {
  //       artifacts: 'node_modules/@sushiswap/bentobox/artifacts',
  //       deploy: 'node_modules/@sushiswap/bentobox/deploy',
  //     },
  //   ],
  // },
}

export default config
