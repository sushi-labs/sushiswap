import type { FullConfig } from '@playwright/test'

async function globalTeardown(_config: FullConfig) {
  // console.log('globalTeardown')
}

export default globalTeardown
