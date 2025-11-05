import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useLocalStorage } from '@sushiswap/hooks'
import { SparkleIcon } from '../../icons/SparkleIcon'
import { Button } from '../button'
import { Card } from '../card'

export const AdvancedTradingExperienceMessage = () => {
  const [hasClosedBanner] = useLocalStorage(
    'has-closed-trade-view-banner',
    false,
  )
  const [hasDismissedMessage, dismissMessage] = useLocalStorage(
    'has-dismissed-message',
    false,
  )
  if (!hasClosedBanner || hasDismissedMessage) {
    return null
  }
  return (
    <>
      <Button
        size="sm"
        className="!rounded-full !z-[55] !absolute right-0 top-0"
        variant="secondary"
        icon={Cog6ToothIcon}
      />

      <div className="inset-0 dark:bg-slate-900/80 bg-gray-100/80 fixed z-50" />
      <div
        onKeyDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="!absolute right-0 top-11 min-w-[320px] !z-[51]"
      >
        <Card
          className={
            'p-5 pb-3 border-accent bg-white flex flex-col gap-3 !backdrop-blur-[40px] dark:!bg-secondary rounded-xl overflow-hidden'
          }
        >
          <SparkleIcon width={20} height={20} />
          <p className="text-sm">
            You can find the Advanced Trading Experience toggle in Settings
            later.
          </p>
          <Button
            onClick={() => {
              dismissMessage(true)
            }}
            className="w-fit px-6"
            variant={'tertiary'}
          >
            OK
          </Button>
        </Card>
      </div>
    </>
  )
}
