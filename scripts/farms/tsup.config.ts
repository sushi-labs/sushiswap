import { defineConfig } from 'tsup'

export default defineConfig({
  target: 'node14',
  noExternal: ['@sushiswap/wagmi', '@sushiswap/graph-client/config', '@sushiswap/graph-client/.graphclient'],
})
