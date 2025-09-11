import { LinkExternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import React, { type FC, type ReactNode, useCallback, useState } from 'react'

interface ExpandableCardRenderProps {
  open: boolean
  setOpen(open: boolean): void
  containerId: string
  titleId: string
}

export interface ExpendableCardData {
  title: string
  caption: string
  content: ReactNode
  link: string
  linkText: string
}

interface ExpandableCardProps extends ExpendableCardData {
  children?(payload: ExpandableCardRenderProps): ReactNode
}

export const ExpandableCard: FC<ExpandableCardProps> = ({
  children,
  title,
  caption,
  content,
  linkText,
  link,
}) => {
  const [id] = useState(nanoid())
  const [open, setOpen] = useState(false)
  const containerId = `container-${id}`
  const titleId = `container-title-${id}`

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <AnimateSharedLayout>
      {children ? (
        children({ open, setOpen, containerId, titleId })
      ) : (
        <motion.div layoutId={`container-${id}`}>
          <motion.div layoutId={`container-title-${id}`}>
            <Button
              onClick={() => setOpen(true)}
              className="mt-3 whitespace-nowrap"
              variant="secondary"
            >
              {title}
            </Button>
          </motion.div>
        </motion.div>
      )}
      <AnimatePresence>
        {open ? (
          <>
            <div className="fixed inset-0 backdrop-blur" />
            <article
              onClick={handleClose}
              onKeyDown={handleClose}
              className="w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] p-4 md:px-[36px] py-0 flex items-center justify-center"
            >
              <motion.div
                layoutId={`container-${id}`}
                className="border border-secondary shadow-lg prose dark:prose-invert bg-white dark:bg-slate-800 p-4 md:p-[36px] max-h-[80vh] overflow-y-scroll scroll overflow-x-hidden rounded-xl flex flex-col items-start"
              >
                <span className="text-xs font-medium mb-1 uppercase text-muted-foreground">
                  {caption}
                </span>
                <motion.h1
                  layoutId={`container-title-${id}`}
                  className="text-3xl text-left"
                >
                  {title}
                </motion.h1>
                <motion.p>{content}</motion.p>
                <motion.div>
                  <LinkExternal href={link}>
                    <Button variant="secondary">{linkText}</Button>
                  </LinkExternal>
                </motion.div>
              </motion.div>
            </article>
          </>
        ) : null}
      </AnimatePresence>
    </AnimateSharedLayout>
  )
}
