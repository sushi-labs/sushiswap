import { type FullConfig } from '@playwright/test'

async function globalTeardown(_config: FullConfig) {
  try {
    console.log('globalTeardown')
  } catch (error) {
    console.error('globalTeardown', error)
  }
}

export default globalTeardown
