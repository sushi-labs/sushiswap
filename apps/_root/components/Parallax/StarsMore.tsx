import { motion } from 'framer-motion'
import { FC } from 'react'

import { StarsMoreSVG } from '../SVG'

export const StarsMore: FC = () => {
  return (
    <motion.li layout>
      <StarsMoreSVG width={640} height={640} />
    </motion.li>
  )
}
