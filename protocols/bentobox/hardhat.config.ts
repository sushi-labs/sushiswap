import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'

import { defaultConfig } from '@sushiswap/hardhat-config'
import { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  ...defaultConfig,
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 256,
      },
    },
  },
}

export default config
