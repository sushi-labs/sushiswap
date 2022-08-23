import { defineConfig } from 'tsup'

export default defineConfig({
  noExternal: ['@sushiswap/wagmi', '@sushiswap/graph-client/config'],
})
