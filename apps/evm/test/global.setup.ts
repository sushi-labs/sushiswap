import { type FullConfig } from '@playwright/test'
// import { loadEnvConfig } from '@next/env'
import { createAnvil } from '@viem/anvil'

async function globalSetup(_config: FullConfig) {
  console.log('globalSetup')
  // const projectDir = process.cwd()
  // loadEnvConfig(projectDir)
  // const { createAnvil } = await import('@viem/anvil')
  const anvil = createAnvil({
    forkUrl: String(process.env.ANVIL_FORK_URL),
    forkBlockNumber: Number(process.env.ANVIL_BLOCK_NUMBER),
    port: Number(process.env.ANVIL_PORT || 8545),
    startTimeout: 60_000,
  })
  return anvil.start()
}

export default globalSetup
