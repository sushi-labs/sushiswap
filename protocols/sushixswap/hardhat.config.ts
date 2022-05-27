import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import '@tenderly/hardhat-tenderly'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { HardhatUserConfig } from 'hardhat/config'

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
  external: {
    contracts: [
      {
        artifacts: 'node_modules/@sushiswap/bentobox/artifacts',
        deploy: 'node_modules/@sushiswap/bentobox/deploy',
      },
    ],
  },
}

export default config
