import { Web3Provider } from '@ethersproject/providers'
import { getNetworkConnector } from 'app/config/wallets'

import getLibrary from './getLibrary'

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(getNetworkConnector().provider))
}
