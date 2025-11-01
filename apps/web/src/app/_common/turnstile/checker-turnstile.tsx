import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Dots } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useTurnstile } from './turnstile-provider'

export function CheckerTurnstile({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useTurnstile()

  return (
    <Checker.Custom
      showChildren={!isLoading}
      onClick={() => {}}
      buttonText={
        <div>
          {'Verifying your browser'}
          <Dots />
        </div>
      }
      disabled
    >
      <Checker.CustomWithTooltip
        showChildren={!isError}
        tooltipTitle="Verification failed"
        tooltipDescription="Verification failed, please refresh the page and try again. If the problem persists, contact support."
        buttonText={
          <div className="flex flex-row items-center gap-1">
            Verification failed <InformationCircleIcon width={16} height={16} />
          </div>
        }
        onClick={() => {}}
        disabled
        className="bg-red-500"
      >
        {children}
      </Checker.CustomWithTooltip>
    </Checker.Custom>
  )
}
