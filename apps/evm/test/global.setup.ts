import { type FullConfig } from '@playwright/test'
// import { createAnvil } from '@viem/anvil'
// import { loadEnvConfig } from '@next/env'

async function globalSetup(_config: FullConfig) {
  console.log('globalSetup')
  // const projectDir = process.cwd()
  // loadEnvConfig(projectDir)
  // const anvil = createAnvil({
  //   forkUrl: String(process.env.ANVIL_FORK_URL),
  //   forkBlockNumber: Number(process.env.ANVIL_BLOCK_NUMBER),
  //   port: Number(process.env.ANVIL_PORT || 8545),
  // })
  // await anvil.start()
}

export default globalSetup
