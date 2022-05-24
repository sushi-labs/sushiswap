import './popover.css'

import { Popover as HeadlessPopover } from '@headlessui/react'
import React, { FC } from 'react'

import { ExtractProps } from '../types'
import { usePopover } from './usePopover'

type Popover = ExtractProps<typeof HeadlessPopover> & {
  arrow?: boolean
}

export const Popover: FC<Popover> = ({ button, panel, children, arrow = true, ...props }) => {
  const { styles, attributes, setReferenceElement, setPopperElement, setArrowElement } = usePopover()

  return (
    <HeadlessPopover {...props}>
      <HeadlessPopover.Button ref={setReferenceElement}>{button}</HeadlessPopover.Button>
      <HeadlessPopover.Panel {...attributes.popper} ref={setPopperElement} style={styles.popper} className="tooltip">
        {panel}
        {arrow && <div ref={setArrowElement} style={styles.arrow} className="arrow" />}
      </HeadlessPopover.Panel>
    </HeadlessPopover>
  )
}
