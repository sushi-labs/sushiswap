import { type FullConfig } from '@playwright/test'
import { startProxy } from '@viem/anvil'
// import 'core-js/proposals/promise-with-resolvers.js'
// import { createServer } from 'prool'
// import { anvil } from 'prool/instances'
export default async function globalSetup(_config: FullConfig) {
  // console.log('globalSetup')

  const shutdown = await startProxy({
    options: {
      forkUrl: String(process.env.ANVIL_FORK_URL),
      forkBlockNumber: Number(process.env.ANVIL_BLOCK_NUMBER),
      startTimeout: 120_000,
    },
  })
  process.on('SIGTERM', shutdown)

  // const server = createServer({
  //   instance: anvil(),
  // })
  // server.start()
  // process.on('SIGTERM', server.stop)
}
