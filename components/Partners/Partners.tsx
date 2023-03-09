import { Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { ArbitrumSVG } from '../SVG/ArbitrumSVG'
import { BarnBridgeSVG } from '../SVG/BarnBridgeSVG'
import { BobaSVG } from '../SVG/BobaSVG'
import { LayerzeroSVG } from '../SVG/LayerzeroSVG'
import { MagnaSVG } from '../SVG/MagnaSVG'
import { MetamaskSVG } from '../SVG/MetamaskSVG'
import { OptimismSVG } from '../SVG/OptimismSVG'
import { PolygonSVG } from '../SVG/PolygonSVG'
import { ZkSyncSVG } from '../SVG/ZkSyncSVG'

const INCEPTION_DATE = new Date('08/26/2020')

export const Partners: FC = () => {
  const diff = Math.floor((new Date().getTime() - INCEPTION_DATE.getTime()) / (60 * 60 * 24 * 1000))

  return (
    <section className="py-20 sm:py-40 px-4 border-t border-neutral-200/10 bg-gradient-to-b from-white/[0.04] to-black">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="flex flex-col items-center">
          <Typography variant="h1" weight={600} className="text-center">
            {diff} Days.
          </Typography>
          <Typography variant="lg" weight={400} className="text-center mt-2 max-w-[420px]">
            Since the inception of Sushi. We appreciate all the friends we’ve made along the way to the Future of
            Finance.
          </Typography>
        </div>
        <div className="flex flex-col gap-y-10">
          <div className="flex justify-center items-center flex-wrap gap-10">
            <ArbitrumSVG width={130} />
            <BarnBridgeSVG width={120} />
            <LayerzeroSVG width={120} />
            <MagnaSVG width={120} />
            <MetamaskSVG width={120} />
          </div>
          <div className="flex justify-center flex-wrap gap-10">
            <OptimismSVG width={120} />
            <PolygonSVG width={120} />
            <ZkSyncSVG width={120} />
            <BobaSVG height={38} />
          </div>
        </div>
      </Container>
    </section>
  )
}
