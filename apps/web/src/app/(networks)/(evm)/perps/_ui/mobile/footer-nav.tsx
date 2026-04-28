import { Button, classNames } from '@sushiswap/ui'
import { CandleSticksIcon } from '@sushiswap/ui/icons/CandleSticksIcon'
import { SushiSubIcon } from '@sushiswap/ui/icons/SushiSubIcon'
import { PerpsCard } from '../_common/perps-card'
import { useAssetSelectorState } from '../asset-selector'
import type { PerpsMobileViewType } from './mobile-layout'

const OPTIONS = [
  {
    value: 'order' as const,
    icon: <SushiSubIcon className="h-5 w-5" />,
  },
  {
    value: 'charts' as const,
    icon: <CandleSticksIcon className="h-5 w-5" />,
  },
]

export const FooterNav = ({
  view,
  setView,
}: {
  view: PerpsMobileViewType
  setView: (view: PerpsMobileViewType) => void
}) => {
  const {
    state: { open },
  } = useAssetSelectorState()
  if (open) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-perps-background rounded-full">
      <PerpsCard
        className={classNames('flex !items-center justify-center p-0.5')}
        rounded="full"
        backdropBlur
      >
        {OPTIONS.map((option) => (
          <Button
            onClick={() => setView(option.value)}
            key={option.value}
            variant={option.value === view ? 'perps-default' : 'ghost'}
            size="lg"
            className={classNames(
              'flex !items-center justify-center w-full !gap-1 focus:!bg-transparent !rounded-full',

              view === option.value
                ? '!text-perps-blue'
                : 'text-perps-muted-50 border border-transparent',
            )}
          >
            {option.icon}
          </Button>
        ))}
      </PerpsCard>
    </div>
  )
}
