import { useSymbolSplit } from 'src/lib/perps'
import { SideToggle } from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetState } from '../trade-widget'

export const OrderBookSideToggle = () => {
  const {
    state: { asset },
  } = useAssetState()
  const {
    state: { orderBookSide },
    mutate: { setOrderBookSide },
  } = useUserSettingsState()
  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })
  return (
    <SideToggle
      side={orderBookSide}
      setSide={setOrderBookSide}
      baseSymbol={baseSymbol}
      quoteSymbol={quoteSymbol}
    />
  )
}
