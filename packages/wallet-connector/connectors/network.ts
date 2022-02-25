import { initializeConnector } from '@web3-react/core'
import { Network } from '@web3-react/network'
import chains from 'chains'

const [connector, hooks, store] = initializeConnector<Network>(
  (actions) => {
    return new Network(
      actions,
      Object.fromEntries(chains.map((chain) => [Number(chain.chainId), String(chain.rpc)])),
      true,
    )
  },
  chains.map(({ chainId }) => Number(chainId)),
)

export const networkConnector = {
  name: 'Network',
  instance: connector,
  hooks,
  store,
}
