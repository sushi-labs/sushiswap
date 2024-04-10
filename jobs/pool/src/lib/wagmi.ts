import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { createConfig } from '@wagmi/core'

export const config = createConfig({
  ...publicWagmiConfig,
})
