import { classNames, Typography } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import { FC } from 'react'

import { CardInterface } from '../data'

interface Card extends CardInterface {
  onSelect(id?: string): void
}

export const Card: FC<Card> = ({ id, title, category, backgroundColor, textColor, onSelect, icon: Icon }) => {
  return (
    <li className="relative h-[240px] flex flex-grow" onClick={() => onSelect(id)}>
      <div className="w-full h-full relative block pointer-events-none hover:scale-[1.02] transition-all">
        <motion.div
          className={classNames(
            'pointer-events-auto relative rounded-[20px] overflow-hidden w-full h-full m-[0_auto] cursor-pointer',
            backgroundColor
          )}
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="absolute top-0 left-0 overflow-hidden h-[240px] w-[100vw]"
            layoutId={`card-image-container-${id}`}
          />
          <motion.div
            className="absolute top-[15px] left-[15px] max-w-[300px] flex flex-col gap-1"
            layoutId={`title-container-${id}`}
          >
            <Typography weight={500} className={classNames(textColor, 'uppercase')}>
              {category}
            </Typography>
            <Typography weight={600} variant="h3" className={textColor}>
              {title}
            </Typography>
          </motion.div>
          <motion.div className="absolute right-3 top-3" layoutId={`title-container-icon-${id}`}>
            <Icon width={26} height={26} className={classNames(textColor, 'opacity-1')} />
          </motion.div>
        </motion.div>
      </div>
    </li>
  )
}
