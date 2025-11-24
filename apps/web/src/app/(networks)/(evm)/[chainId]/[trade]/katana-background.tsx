'use client'
import Image from 'next/image'
import { ChainId } from 'sushi'
import { useDerivedStateSimpleTrade } from './_ui/swap/trade/derivedstate-simple-trade-provider'

export const KatanaBackground = ({ chainId }: { chainId: ChainId }) => {
  const {
    state: { tradeView, chainId: derivedChainId, chainId1 },
  } = useDerivedStateSimpleTrade()

  const isAdvancedTrade = tradeView === 'advanced'

  if (
    (chainId === ChainId.KATANA ||
      derivedChainId === ChainId.KATANA ||
      chainId1 === ChainId.KATANA) &&
    !isAdvancedTrade
  ) {
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
  return null
}
