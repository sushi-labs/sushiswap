import { motion } from 'framer-motion'
import { FC } from 'react'

import { StarsSVG } from '../SVG'

export const Stars: FC = () => {
  return (
    <motion.li layout>
      <StarsSVG width={640} height={640} />
    </motion.li>
  )
}
