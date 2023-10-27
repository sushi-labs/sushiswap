import { type FullConfig } from '@playwright/test'

// import { startProxy } from '@viem/anvil'
// import { createERC20 } from './create-erc20'
import './anvil-proxy'
import { proxy } from './anvil-proxy'

export default async function globalSetup(_config: FullConfig) {
  console.log('globalSetup')
  return proxy
  // const anvil = createAnvil({
  //   forkUrl: String(process.env.ANVIL_FORK_URL),
  //   forkBlockNumber: Number(process.env.ANVIL_BLOCK_NUMBER),
  //   port: Number(process.env.ANVIL_PORT || 8545),
  //   startTimeout: 60_000,
  // })
  // return anvil.start()
  // return startProxy({
  //   port: Number(process.env.ANVIL_PORT || 8545),
  //   options: {
  //     forkUrl: String(process.env.ANVIL_FORK_URL),
  //     forkBlockNumber: Number(process.env.ANVIL_BLOCK_NUMBER),
  //     startTimeout: 60_000,
  //   },
  // })
}
