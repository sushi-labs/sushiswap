import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      '~evm': fileURLToPath(
        new URL('./src/app/(networks)/(evm)', import.meta.url),
      ),
      '~stellar': fileURLToPath(
        new URL('./src/app/(networks)/(non-evm)/stellar', import.meta.url),
      ),
    },
  },
})
