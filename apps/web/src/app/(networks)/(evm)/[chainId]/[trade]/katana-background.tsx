'use client'
import Image from 'next/image'
import { useDerivedStateSimpleTrade } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
import { ChainId } from 'sushi'

export const KatanaBackground = ({ chainId }: { chainId: ChainId }) => {
  const {
    state: { tradeView },
  } = useDerivedStateSimpleTrade()

  const isAdvancedTrade = tradeView === 'advanced'

  if (chainId !== ChainId.KATANA || isAdvancedTrade) {
    return null
  }
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/katana-bg-light.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left dark:hidden"
      />
      <Image
        src="/katana-bg-dark.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left hidden dark:block"
      />
      <div
        className={`
          absolute inset-0
          bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,255,255,0.80)_8.1%,_rgba(255,255,255,0)_100%)]
          dark:bg-[linear-gradient(180deg,_#0F172A_0%,_rgba(15,23,42,0.80)_8.1%,_rgba(15,23,42,0)_100%)]
        `}
      />
    </div>
  )
}
