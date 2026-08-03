import { CheckIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { CreateStep } from './create-launch-types'

const STEPS: Array<{ id: CreateStep; label: string }> = [
  { id: 'details', label: 'Token details' },
  { id: 'buy', label: 'Initial buy' },
  { id: 'review', label: 'Review' },
]

export function CreateStepNavigation({
  step,
  canNavigateToBuy,
  canNavigateToReview,
  onNavigate,
}: {
  step: CreateStep
  canNavigateToBuy: boolean
  canNavigateToReview: boolean
  onNavigate: (step: CreateStep) => void
}) {
  const stepIndex = STEPS.findIndex((item) => item.id === step)

  return (
    <div className="mt-7">
      <PerpsCard className="grid grid-cols-3 gap-2 p-2" fullWidth>
        {STEPS.map((item, index) => {
          const isAvailable =
            item.id === 'details' ||
            (item.id === 'buy' ? canNavigateToBuy : canNavigateToReview)
          const isNavigable = isAvailable && item.id !== step

          return (
            <button
              key={item.id}
              type="button"
              disabled={!isNavigable}
              aria-current={step === item.id ? 'step' : undefined}
              onClick={() => onNavigate(item.id)}
              className={classNames(
                'flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium transition sm:text-sm',
                isNavigable
                  ? 'cursor-pointer hover:bg-white/[0.04] hover:text-perps-muted'
                  : 'cursor-default',
                step === item.id
                  ? 'bg-white/[0.07] text-perps-muted shadow-sm'
                  : index < stepIndex
                    ? 'text-perps-blue'
                    : 'text-perps-muted-50',
              )}
            >
              <span
                className={classNames(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] leading-none',
                  index < stepIndex
                    ? 'border-perps-blue bg-perps-blue text-white'
                    : 'border-current',
                )}
              >
                {index < stepIndex ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
      </PerpsCard>
    </div>
  )
}
