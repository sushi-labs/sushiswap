import { initializeConnector } from '@web3-react/core'
import { Network } from '@web3-react/network'
import chain from 'chain'

const [connector, hooks, store] = initializeConnector<Network>(
  (actions) => {
    return new Network(
      actions,
      Object.fromEntries(Object.entries(chain).map(([chainId, { rpc }]) => [Number(chainId), rpc])),
      true,
    )
  },
  Object.entries(chain).map(([chainId]) => Number(chainId)),
)

export const networkConnector = {
  name: 'Network',
  instance: connector,
  hooks,
  store,
}
