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
        'relative flex justify-center w-full transition-all p-3 bg-gradient-to-br from-[#4A9079] backdrop-blur-sm dark:from-[#4A9079]/80 to-[#4A9079]/40 dark:to-[#4A9079]/30 animate-slide',
        className,
      )}
    >
      <div className="flex items-center gap-3 font-medium">
        <span className="text-black/80 dark:text-white/80">
          <span className="font-bold">SushiSwap</span> on{' '}
          <span className="font-bold">Kadena</span>{' '}
          <br className="block sm:hidden" /> Operates on{' '}
          <span className="dark:text-yellow-300 text-[#f3e035] bg-blend-color">
            Chain
          </span>{' '}
          - {KADENA_CHAIN_ID}
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
