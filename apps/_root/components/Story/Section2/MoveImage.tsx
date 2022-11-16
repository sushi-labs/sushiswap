import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { NetworkStellarSVG } from '../../SVG/NetworkStellarSVG'

export const MoveImage = () => {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: scrollRef, axis: 'y', offset: ['end end', 'start end'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <div ref={scrollRef}>
      <motion.div style={{ opacity, scale }} className="relative scale-[0.9] sm:scale-[1] relative relative">
        <div className="z-[1] absolute w-[423px] h-[320px]">
          <div className="blur-[100px] opacity-[0.25] w-full h-full rounded-full h-full w-full bg-[linear-gradient(160.45deg,_#F760E7_8.22%,_#197FDE_91.32%)]" />
        </div>
        <NetworkStellarSVG width={423} height={320} />
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center z-[2]">
          <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} width={112} height={112} />
        </div>
      </motion.div>
    </div>
  )
}
