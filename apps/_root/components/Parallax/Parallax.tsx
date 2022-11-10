import { AnimateSharedLayout, motion } from 'framer-motion'
import { FC } from 'react'

import { Stars } from './Stars'
import { StarsMore } from './StarsMore'

export const Parallax: FC = () => {
  return (
    <AnimateSharedLayout>
      <motion.ul layout>
        <StarsMore />
        <Stars />
      </motion.ul>
    </AnimateSharedLayout>
  )
}
