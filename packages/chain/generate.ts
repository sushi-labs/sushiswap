import { Chain, ChainId } from '.'
import fetch from 'node-fetch'
import { writeFileSync } from 'fs'

async function generate() {
  const allChains = await fetch('https://chainid.network/chains.json').then((data) => data.json() as Promise<Chain[]>)
  const filteredChains = allChains.filter(({ chainId }) => Object.values(ChainId).includes(chainId))

  writeFileSync('./chains.ts', `export default ${JSON.stringify(filteredChains)} as const`)
  process.exit(0)
}

generate()
