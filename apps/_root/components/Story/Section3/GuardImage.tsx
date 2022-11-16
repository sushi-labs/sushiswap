import { useIsSmScreen } from '@sushiswap/hooks'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { GuardPlanetsSVG } from '../../SVG/GuardPlanetsSVG'

export const GuardImage = () => {
  const isSmallScreen = useIsSmScreen()
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: scrollRef, axis: 'y', offset: ['end end', 'start end'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <div ref={scrollRef}>
      <motion.div
        {...(!isSmallScreen && { ...{ style: { opacity, scale } } })}
        className="relative scale-[0.9] sm:scale-[1] relative relative"
      >
        <GuardPlanetsSVG />
      </motion.div>
    </div>
  )
}
