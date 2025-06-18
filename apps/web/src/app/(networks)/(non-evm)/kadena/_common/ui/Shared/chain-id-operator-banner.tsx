'use client'
import { XIcon } from '@heroicons/react-v1/solid'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Button, classNames } from '@sushiswap/ui'
import { KADENA_CHAIN_ID } from '~kadena/_common/constants/network'

export const ChainIdOperatorBanner = ({
  className,
}: { className?: string }) => {
  const isMounted = useIsMounted()
  const [hasClosedBanner, closeBanner] = useLocalStorage(
    'has-closed-kadena-chain-id-operator-banner',
    false,
  )

  const handleCloseBanner = () => {
    closeBanner(true)
  }

  if (hasClosedBanner || !isMounted) return null

  return (
    <div
      className={classNames(
        'relative flex justify-center w-full p-3 bg-gradient-to-r from-[#4A9079] backdrop-blur-sm dark:from-[#4A9079]/80 to-[#4A9079]/40 dark:to-[#4A9079]/30 animate-slide',
        className,
      )}
    >
      <div className="flex items-center gap-3 font-medium">
        <span className="text-transparent bg-gradient-to-r from-black to-black/80 bg-clip-text dark:from-white dark:to-white/80">
          SushiSwap on Kadena <br className="block xs:hidden" /> Operates on
          Chain: {KADENA_CHAIN_ID}
        </span>
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
