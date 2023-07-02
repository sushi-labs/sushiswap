import { NetworkCheck as WagmiNetworkCheck } from '@sushiswap/wagmi/future/components'
import { FC } from 'react'

import { useSwapState } from './trade/TradeProvider'

export const NetworkCheck: FC = () => {
  const { network0 } = useSwapState()
  return <WagmiNetworkCheck chainId={network0} />
}
