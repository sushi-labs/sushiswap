import { useLocalStorage } from '@sushiswap/hooks'
import { Card } from '../card'
import { SparkleIcon } from '../../icons/Sparkle'
import { Button } from '../button'

export const Trade2ExperienceMessage = () => {
  const [hasClosedBanner] = useLocalStorage(
    'has-closed-trade-view-banner',
    false,
  )
  const [hasDismissedMessage, dismissMessage] = useLocalStorage(
    'has-dismissed-message',
    false,
  )
  return (
    <>
      {hasClosedBanner && !hasDismissedMessage ? (
        <>
          <div className="w-screen h-screen top-12 left-0 bottom-0 right-0 dark:bg-[#0C0C23]/50 bg-[#f3f2f4]/50 fixed z-[11]" />
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="!absolute -right-5 top-12 min-w-[320px] !z-[11]"
          >
            <Card
              className={
                'p-5 pb-3 border-accent bg-white flex flex-col gap-3 !backdrop-blur-[20px] dark:!bg-secondary rounded-xl overflow-hidden'
              }
            >
              <SparkleIcon width={20} height={20} />
              <p className="text-sm">
                You can find the Trade Experience toggle in Settings later.
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
      ) : null}
    </>
  )
}
