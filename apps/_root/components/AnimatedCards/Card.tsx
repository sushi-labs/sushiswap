import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, classNames, Typography } from '@sushiswap/ui'
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
            className="absolute top-[30px] left-[30px] max-w-[300px] flex flex-col gap-4"
            layoutId={`title-container-${id}`}
          >
            <div className="flex gap-3 items-center">
              <motion.div layoutId={`title-container-icon-${id}`}>
                <Icon width={40} height={40} className={classNames(textColor, 'opacity-1')} />
              </motion.div>
              <Typography weight={500} className={classNames(textColor, 'text-neutral-400')}>
                {category}
              </Typography>
            </div>
            <Typography weight={600} variant="h3" className={textColor}>
              {title}
            </Typography>
            <motion.div layoutId={`title-container-view-more-${id}`}>
              <Button className="!p-0" variant="empty" endIcon={<ChevronRightIcon width={16} height={16} />}>
                View More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </li>
  )
}
