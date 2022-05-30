import { Popover as HeadlessPopover } from '@headlessui/react'
import React, { FC, Fragment, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { ExtractProps } from '../types'
import { usePopover } from './usePopover'

type Popover = ExtractProps<typeof HeadlessPopover> & {
  arrow?: boolean
}

export const Popover: FC<Popover> = ({ button, panel, children, arrow = true, ...props }) => {
  const { styles, attributes, setReferenceElement, setPopperElement, setArrowElement } = usePopover()

  useEffect(() => {
    if (!document.getElementById('popover-portal')) {
      throw new Error('Please wrap your app with the ThemeProvider')
    }
  }, [])

  return (
    <HeadlessPopover {...props} as={Fragment}>
      <HeadlessPopover.Button ref={setReferenceElement}>{button}</HeadlessPopover.Button>
      {ReactDOM.createPortal(
        <HeadlessPopover.Panel {...attributes.popper} ref={setPopperElement} style={styles.popper} className="tooltip">
          {panel}
          {arrow && <div ref={setArrowElement} style={styles.arrow} className="arrow" />}
        </HeadlessPopover.Panel>,
        document.querySelector('#popover-portal') as Element
      )}
    </HeadlessPopover>
  )
}
