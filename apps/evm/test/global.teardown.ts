import { type FullConfig } from '@playwright/test'
import { proxy } from './anvil-proxy'

async function globalTeardown(_config: FullConfig) {
  try {
    console.log('globalTeardown')
    const shutdown = await proxy
    await shutdown()
  } catch (error) {
    console.error('globalTeardown', error)
  }
}

export default globalTeardown
