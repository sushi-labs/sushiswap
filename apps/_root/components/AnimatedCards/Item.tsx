import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Button, classNames, Link, Typography } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import React, { FC } from 'react'

import { CardInterface } from '../data'

export const Item: FC<{ id: string; onSelect(id?: string): void; data: CardInterface[] }> = ({
  id,
  onSelect,
  data,
}) => {
  const {
    category,
    title,
    backgroundColor,
    icon: Icon,
    textColor,
    content,
    link,
    audience,
  } = data.find((item) => item.id === id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ pointerEvents: 'auto' }}
        className="z-[2000] fixed bg-[rgba(0,0,0,0.6)] will-change-[opacity] inset-0 w-full"
        onClick={() => onSelect()}
      />
      <article
        onClick={() => onSelect()}
        className="w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden px-[40px] py-0 flex items-center justify-center"
      >
        <motion.div
          layoutId={`card-container-${id}`}
          className={classNames(
            backgroundColor,
            'h-[auto] max-w-[700px] overflow-hidden relative rounded-[20px] overflow-hidden w-full h-full m-[0_auto]'
          )}
        >
          <motion.div
            className="absolute z-10 flex items-center right-10 top-5"
            layoutId={`title-container-icon-${id}`}
          >
            <Icon width={180} height={180} className="opacity-20" />
          </motion.div>
          <motion.div
            className={classNames('absolute top-0 left-0 overflow-hidden h-[240px] w-[100vw] z-[1]', backgroundColor)}
            layoutId={`card-image-container-${id}`}
          />
          <motion.div
            className="z-[1] absolute top-[30px] left-[30px] max-w-[300px] flex flex-col gap-2 m-3 rounded-[20px]"
            layoutId={`title-container-${id}`}
          >
            <Typography variant="xs" weight={600} className={classNames(textColor, 'text-neutral-400 uppercase')}>
              For {audience}
            </Typography>
            <Typography weight={600} variant="h3" className={classNames(textColor)}>
              {title}
            </Typography>
          </motion.div>
          <motion.div
            className="p-[280px_35px_35px_35px] max-w-[700px] w-[90vw] prose !prose-invert prose-neutral"
            animate
          >
            {content}
            <motion.div layoutId={`title-container-view-more-${id}`}>
              <div className="flex">
                <Button
                  target="_blank"
                  as={Link.External}
                  href={link}
                  className="!p-0 !no-underline"
                  variant="empty"
                  endIcon={<ExternalLinkIcon width={16} height={16} />}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </article>
    </>
  )
}
