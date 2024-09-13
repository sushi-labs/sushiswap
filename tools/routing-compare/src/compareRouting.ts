import { ChainId } from 'sushi'
import { checkRoute, compareRouteAllNetworks } from './index.js'

if (process.argv.length < 3) {
  compareRouteAllNetworks()
} else {
  const network = parseInt(process.argv[2] as string)
  checkRoute(network as ChainId)
}
