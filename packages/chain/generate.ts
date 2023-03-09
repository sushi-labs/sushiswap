import { writeFileSync } from 'fs'
import fetch from 'node-fetch'

import { Chain, ChainId } from '.'

async function generate() {
  const allChains = await fetch('https://chainid.network/chains.json').then((data) => data.json() as Promise<Chain[]>)
  const filteredChains = allChains.filter(({ chainId }) => Object.values(ChainId).includes(chainId))

  writeFileSync('./chains.ts', `export default ${JSON.stringify(filteredChains, null, 2)} as const`)
  process.exit(0)
}

generate()
