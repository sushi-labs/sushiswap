import { type FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('globalSetup')
}

export default globalSetup
