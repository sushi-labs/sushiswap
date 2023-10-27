// import childProcess from 'child_process'
// import { promisify } from 'util'
import { type FullConfig } from '@playwright/test'
// const exec = promisify(childProcess.exec)

async function globalTeardown(_config: FullConfig) {
  console.log('globalTeardown')
  // try {
  //   const { stderr, stdout } = await exec('pkill -2 anvil')
  //   if (stderr) {
  //     console.log(`stderr: ${stderr}`)
  //     return
  //   }
  //   console.log(`stdout: ${stdout}`)
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log(`error: ${error.message}`)
  //   }
  //   return
  // }
}

export default globalTeardown
