import { XIcon } from '@heroicons/react-v1/solid'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Button, Switch } from '@sushiswap/ui'
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider'

export const TradeViewSwitch = () => {
  const {
    mutate: { setTradeView },
    state: { tradeView },
  } = useDerivedStateSimpleTrade()
  const isMounted = useIsMounted()
  const [hasClosedBanner, closeBanner] = useLocalStorage(
    'has-closed-trade-view-banner',
    false,
  )

  const handleCloseBanner = () => {
    closeBanner(true)
  }

  if (hasClosedBanner || !isMounted) return null

  return (
    <div className="w-full flex justify-center p-3 bg-gradient-to-r relative from-blue/10 to-skyblue/10 animate-slide">
      <div className="flex items-center gap-3 font-medium">
        <span className="bg-gradient-to-r from-blue to-skyblue bg-clip-text text-transparent">
          Trade 2.0 Experience
        </span>
        <Switch
          checked={tradeView === 'advanced'}
          onCheckedChange={(e) => setTradeView(e ? 'advanced' : 'simple')}
        />
      </div>
      <Button
        onClick={handleCloseBanner}
        variant="ghost"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2"
      >
        <XIcon width={15} height={15} />
      </Button>
    </div>
  )
}
