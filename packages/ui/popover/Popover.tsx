import { Popover as HeadlessPopover } from '@headlessui/react'
import React, { FC, Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { classNames } from '../index'
import { ExtractProps } from '../types'
import { usePopover } from './usePopover'

type Popover = ExtractProps<typeof HeadlessPopover> & {
  hover?: boolean
  arrow?: boolean
}

export const Popover: FC<Popover> = ({ button, panel, hover, arrow = true, ...props }) => {
  const [show, setShow] = useState(false)
  const { styles, attributes, setReferenceElement, setPopperElement, setArrowElement } = usePopover()

  useEffect(() => {
    if (!document.getElementById('popover-portal')) {
      throw new Error('Please wrap your app with the ThemeProvider')
    }
  }, [])

  return (
    <HeadlessPopover {...props} as={Fragment}>
      {({ open }) => (
        <>
          <HeadlessPopover.Button
            as="div"
            ref={setReferenceElement}
            {...(hover && { onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false) })}
          >
            {button}
          </HeadlessPopover.Button>
          {(show || open) &&
            ReactDOM.createPortal(
              <HeadlessPopover.Panel
                {...attributes.popper}
                ref={setPopperElement}
                style={styles.popper}
                className="tooltip z-[100]"
                static
              >
                {React.cloneElement(
                  panel,
                  {
                    ...panel.props,
                    className: classNames(
                      panel.props.className,
                      'shadow-md ring-1 ring-black/10 rounded-2xl overflow-hidden'
                    ),
                  },
                  panel.props.children
                )}
                {arrow && <div ref={setArrowElement} style={styles.arrow} className="arrow" />}
              </HeadlessPopover.Panel>,
              document.querySelector('#popover-portal') as Element
            )}
        </>
      )}
    </HeadlessPopover>
  )
}
