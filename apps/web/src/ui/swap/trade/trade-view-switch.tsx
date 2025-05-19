import { Switch } from '@sushiswap/ui'
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider'

export const TradeViewSwitch = () => {
  const {
    mutate: { setTradeView },
    state: { tradeView },
  } = useDerivedStateSimpleTrade()

  return (
    <div className="w-full flex justify-center p-3 bg-gradient-to-r from-blue/10 to-skyblue/10 animate-slide">
      <div className="flex items-center gap-3 font-medium">
        <span className="bg-gradient-to-r from-blue to-skyblue bg-clip-text text-transparent">
          Trade 2.0 Experience
        </span>
        <Switch
          checked={tradeView === 'advanced'}
          onCheckedChange={(e) => setTradeView(e ? 'advanced' : 'simple')}
        />
      </div>
    </div>
  )
}
