/// <reference lib="dom" />
import { existsSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ChainId } from '../src/chain/constants.js'
import { type Chain } from '../src/chain/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
;(async () => {
  const file = path.resolve(__dirname, '../src/chain/generated.ts')
  if (!existsSync(file)) {
    const chains = await fetch('https://chainid.network/chains.json').then(
      (data) => data.json() as Promise<Chain[]>,
    )
    writeFileSync(
      file,
      `export default ${JSON.stringify(
        chains
          .filter(({ chainId }) =>
            Object.values(ChainId).find((id) => id === chainId),
          )
          .map(
            ({
              chainId,
              explorers,
              nativeCurrency,
              name,
              shortName,
              parent,
            }) => ({
              chainId,
              explorers,
              nativeCurrency,
              name,
              shortName,
              parent,
            }),
          ),
        null,
        2,
      )} as const;\n\n`,
    )
  }
  process.exit(0)
})()
