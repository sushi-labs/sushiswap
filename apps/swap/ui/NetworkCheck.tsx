import { FC } from 'react'
import { useSwapState } from './trade/TradeProvider'
import { NetworkCheck as WagmiNetworkCheck } from '@sushiswap/wagmi/future/components'

export const NetworkCheck: FC = () => {
  const { network0 } = useSwapState()
  return <WagmiNetworkCheck chainId={network0} />
}
