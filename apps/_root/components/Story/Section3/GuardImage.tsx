import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { useRef } from 'react'

import { GuardPlanetsSVG } from '../../SVG/GuardPlanetsSVG'

const variants: Variants = {
  hidden: {
    rotate: 0,
    opacity: 0,
  },
  visible: {
    rotate: 90,
    opacity: 1,
  },
}

export const GuardImage = () => {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: scrollRef, axis: 'y' })
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.7, 1], [1, 1.5])

  return (
    <div ref={scrollRef}>
      <motion.div style={{ opacity, scale }} className="relative scale-[0.9] sm:scale-[1] relative relative">
        <GuardPlanetsSVG />
      </motion.div>
    </div>
  )
}
