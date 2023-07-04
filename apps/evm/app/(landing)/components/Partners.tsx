import { Container } from '@sushiswap/ui/components/container'
import { FC } from 'react'

import {
  ArbitrumSVG,
  BarnBridgeSVG,
  LayerzeroSVG,
  MagnaSVG,
  MetamaskSVG,
  OptimismSVG,
  PolygonSVG,
  ThunderCoreSVG,
  ZkSyncSVG,
} from './svgs'

const INCEPTION_DATE = new Date('08/26/2020')

export const Partners: FC = () => {
  const diff = Math.floor((new Date().getTime() - INCEPTION_DATE.getTime()) / (60 * 60 * 24 * 1000))

  return (
    <section className="py-20 sm:py-40 px-4 border-t border-neutral-200/10 bg-gradient-to-b from-white/[0.04] to-black">
      <Container maxWidth="6xl" className="px-4 mx-auto space-y-20">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-semibold  text-center">{diff} Days.</p>
          <p className="text-lg text-center mt-2 max-w-[420px]">
            Since the inception of Sushi. We appreciate all the friends we’ve made along the way to the Future of
            Finance.
          </p>
        </div>
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <ArbitrumSVG width={130} />
            <BarnBridgeSVG width={120} />
            <LayerzeroSVG width={120} />
            <MagnaSVG width={120} />
            <MetamaskSVG width={120} />
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <OptimismSVG width={120} />
            <PolygonSVG width={120} />
            <ZkSyncSVG width={120} />
            <ThunderCoreSVG height={35} />
          </div>
        </div>
      </Container>
    </section>
  )
}
