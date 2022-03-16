import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { Network } from '@web3-react/network'
import { Web3ReactStore } from '@web3-react/types'
import chain from 'chain'

export const connector: [Network, Web3ReactHooks, Web3ReactStore] = initializeConnector<Network>(
  (actions) => {
    return new Network(
      actions,
      Object.fromEntries(Object.entries(chain).map(([chainId, { rpc }]) => [Number(chainId), rpc])),
      false,
    )
  },
  Object.entries(chain).map(([chainId]) => Number(chainId)),
)

export default connector
