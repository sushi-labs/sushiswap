import { Container } from '@sushiswap/ui'
import type { FC } from 'react'

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
  const diff = Math.floor(
    (new Date().getTime() - INCEPTION_DATE.getTime()) / (60 * 60 * 24 * 1000),
  )

  return (
    <section className="py-20 sm:py-40 px-4 bg-gradient-to-b from-secondary to-transparent">
      <Container maxWidth="5xl" className="px-4 mx-auto space-y-20">
        <div className="flex flex-col items-center text-center prose dark:prose-invert mx-auto">
          <h1>{diff} Days.</h1>
          <h5>
            Ever since the inception of Sushi, our journey has been enriched by
            the invaluable connections we{`'`}ve forged. As we pave the way
            towards the Future of Finance, we want to express our deep gratitude
            to the incredible community of friends and supporters who have
            accompanied us on this remarkable path
          </h5>
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
