import { existsSync, writeFileSync } from 'fs'
import path from 'path'

import { type Chain } from '../src/chain'
import { ChainId } from '../src/chain/constants'
;(async function () {
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
