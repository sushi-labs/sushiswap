import { initializeConnector } from '@web3-react/core'
import { Network } from '@web3-react/network'
import chains from 'chains'

const [connector, hooks, store] = initializeConnector<Network>(
  (actions) => {
    return new Network(
      actions,
      Object.fromEntries(Object.entries(chains).map(([chainId, { rpc }]) => [Number(chainId), String(rpc)])),
      true,
    )
  },
  Object.entries(chains).map(([chainId]) => Number(chainId)),
)

export const networkConnector = {
  name: 'Network',
  instance: connector,
  hooks,
  store,
}
