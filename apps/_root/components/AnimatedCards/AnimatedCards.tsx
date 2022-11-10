import { AnimatePresence, AnimateSharedLayout, useInView } from 'framer-motion'
import { FC, useRef, useState } from 'react'

import { CardInterface } from '../data'
import { Item } from './Item'
import { List } from './List'

export const AnimatedCards: FC<{ data: CardInterface[] }> = ({ data }) => {
  const [id, setId] = useState<string>()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section
      className="w-full"
      ref={ref}
      style={{
        transform: isInView ? 'none' : 'translateY(100px)',
        opacity: isInView ? 1 : 0,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
      }}
    >
      <AnimateSharedLayout>
        <List selectedId={id} onSelect={setId} data={data} />
        <AnimatePresence>{id && <Item id={id} key="item" onSelect={setId} data={data} />}</AnimatePresence>
      </AnimateSharedLayout>
    </section>
  )
}
