import { Button } from '@sushiswap/ui/components/button'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import React, { FC, ReactNode, useCallback, useState } from 'react'

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

export const ExpandableCard: FC<ExpandableCardProps> = ({ children, title, caption, content, linkText, link }) => {
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
            <Button onClick={() => setOpen(true)} className="mt-3 whitespace-nowrap" variant="secondary">
              {title}
            </Button>
          </motion.div>
        </motion.div>
      )}
      <AnimatePresence>
        {open && (
          <>
            {/*<motion.div*/}
            {/*  initial={{ opacity: 0 }}*/}
            {/*  animate={{ opacity: 1 }}*/}
            {/*  exit={{ opacity: 0, transition: { duration: 0.15 } }}*/}
            {/*  transition={{ duration: 0.2, delay: 0.15 }}*/}
            {/*  style={{ pointerEvents: 'auto' }}*/}
            {/*  className="z-[2000] fixed bg-[rgba(0,0,0,0.9)] will-change-[opacity] inset-0 w-full"*/}
            {/*  onClick={handleClose}*/}
            {/*/>*/}
            <article
              onClick={handleClose}
              onKeyDown={handleClose}
              className="w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden p-4 md:px-[36px] py-0 flex items-center justify-center"
            >
              <motion.div
                layoutId={`container-${id}`}
                className="bg-neutral-800 p-4 md:p-[36px] max-h-[80vh] overflow-y-scroll scroll overflow-x-hidden rounded-xl flex flex-col gap-2 items-start"
              >
                <span className="text-xs font-medium mb-1 uppercase text-neutral-400">{caption}</span>
                <motion.h1 layoutId={`container-title-${id}`} className="text-4xl font-semibold text-left">
                  {title}
                </motion.h1>
                <motion.div className="max-w-[700px] prose !prose-invert prose-neutral mt-5 pt-5 border-t border-neutral-200/5">
                  {content}
                </motion.div>
                <motion.div className="mt-3">
                  <Button variant="secondary">
                    <a target="_blank" href={link} rel="noopener noreferrer">
                      {linkText}
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </article>
          </>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  )
}
