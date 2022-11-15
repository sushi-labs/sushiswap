import { motion, useScroll, useTransform } from 'framer-motion'

import { StarsBgSVG } from '../SVG/StarsBgSVG'

export const Parallax = () => {
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -1800])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -1000])

  return (
    <>
      <div className="fixed w-[100vw] h-[750px] top-0 pointer-events-none z-[-1]">
        <motion.div className="opacity-[0.15]" style={{ y: y1, x: -400 }}>
          <StarsBgSVG width="100vw" height="750px" />
        </motion.div>
      </div>

      <div className="fixed w-[100vw] h-[750px] bottom-0 pointer-events-none z-[-1]">
        <motion.div className="opacity-[0.2] rotate-90" style={{ y: y2, x: 400 }}>
          <StarsBgSVG width="100vw" height="750px" />
        </motion.div>
      </div>
    </>
  )
}
