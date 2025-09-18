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
    <div className="relative flex justify-center w-full z-10 p-3 bg-blue/10 dark:bg-accent animate-slide">
      <div className="flex items-center gap-3 font-medium">
        <span className="text-blue dark:text-white">
          Advanced Trading Experience
        </span>
        <Switch
          checked={tradeView === 'advanced'}
          onCheckedChange={(e) => setTradeView(e ? 'advanced' : 'simple')}
        />
      </div>
      <Button
        onClick={handleCloseBanner}
        variant="ghost"
        className="absolute -translate-y-1/2 right-2 md:right-4 top-1/2"
      >
        <XIcon width={15} height={15} />
      </Button>
    </div>
  )
}
