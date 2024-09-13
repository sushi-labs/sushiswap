import { ChainId } from 'sushi'
import { findWorstSushiRoute } from './index.js'

if (process.argv.length < 3) {
  console.log('Usage: pnpm findWorseSushiRoute <chainId>')
} else {
  const network = parseInt(process.argv[2] as string)
  findWorstSushiRoute(network as ChainId)
}
