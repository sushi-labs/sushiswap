import { defineConfig } from 'tsup'

export default defineConfig({
  noExternal: ['@sushiswap/graph-client/config'],
})
