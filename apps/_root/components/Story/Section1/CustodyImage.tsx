import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { IphoneMockupSVG } from '../../SVG/IphoneMockup'

export const CustodyImage = () => {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: scrollRef, axis: 'y' })
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.7, 1], [1, 1.5])

  return (
    <div ref={scrollRef}>
      <motion.div style={{ opacity, scale }} className="scale-[0.9] sm:scale-[1] relative -left-[140px] sm:left-0">
        <div className="flex items-center justify-center relative">
          <div className="z-[0] absolute w-[358px] h-[358px]">
            <div className="w-full h-full rounded-full h-full w-full bg-[linear-gradient(160.45deg,_#F760E7_8.22%,_#197FDE_91.32%)]" />
          </div>
          <div className="z-[1] flex items-center justify-center bg-[linear-gradient(69.95deg,_#6F89A0_-14.87%,_#692963_134.4%)] rounded-[28px] border-[9px] border-slate-900">
            <IphoneMockupSVG width={490} height={235} />
          </div>
          <div className="absolute z-[2] bg-slate-900 rounded-full">
            <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} width={112} height={112} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
