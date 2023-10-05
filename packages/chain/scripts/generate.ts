import { writeFileSync } from 'fs'
import fetch from 'node-fetch'
import path from 'path'

import { Chain, ChainId } from '../dist'

async function generate() {
  const allChains = await fetch('https://chainid.network/chains.json').then((data) => data.json() as Promise<Chain[]>)
  const filteredChains = allChains.filter(({ chainId }) => Object.values(ChainId).find((id) => id === chainId)).map(({ chainId, explorers, nativeCurrency, name, shortName, parent  }) => ({
    chainId,
    explorers,
    nativeCurrency,
    name,
    shortName,
    parent
  }))

  writeFileSync(
    path.resolve(__dirname, '../src/generated.ts'),
    `export default ${JSON.stringify(filteredChains, null, 2)} as const`
  )
  process.exit(0)
}

generate()
