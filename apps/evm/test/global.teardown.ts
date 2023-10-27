import childProcess from 'child_process'
import { promisify } from 'util'
import { type FullConfig } from '@playwright/test'
const exec = promisify(childProcess.exec)

async function globalTeardown(_config: FullConfig) {
  console.log('globalTeardown')
  await exec('pkill -2 anvil')
}

export default globalTeardown
