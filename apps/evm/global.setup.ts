import { type FullConfig } from '@playwright/test'
// import { loadEnvConfig } from '@next/env'

async function globalSetup(_config: FullConfig) {
  console.log('globalSetup')
  // const projectDir = process.cwd()
  // loadEnvConfig(projectDir)
}

export default globalSetup
