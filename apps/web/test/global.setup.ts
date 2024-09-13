// import 'core-js/proposals/promise-with-resolvers.js'
// import { createServer } from 'prool'
// import { anvil } from 'prool/instances'

import { type FullConfig } from '@playwright/test'
import { startProxy } from '@viem/anvil'

export default async function globalSetup(_config: FullConfig) {
  // console.log('globalSetup')

  const forkUrl = String(process.env.ANVIL_FORK_URL)
  const forkBlockNumber = Number(process.env.ANVIL_BLOCK_NUMBER)

  // const server = createServer({
  //   instance: anvil({
  //     forkUrl,
  //     forkBlockNumber,
  //     timeout: 120_000,
  //   }),
  // })
  // await server.start()
  // process.on('SIGTERM', server.stop)

  const shutdown = await startProxy({
    options: {
      forkUrl,
      forkBlockNumber,
      startTimeout: 120_000,
      // noMining: true,
    },
  })
  process.on('SIGTERM', shutdown)
}
