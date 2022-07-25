import { Popover as HeadlessPopover } from '@headlessui/react'
import * as PopperJS from '@popperjs/core'
import React, { FC, Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { classNames } from '../index'
import { ExtractProps } from '../types'
import { usePopover } from './usePopover'

type Popover = ExtractProps<typeof HeadlessPopover> & {
  tabIndex?: number
  hover?: boolean
  disableClickListener?: boolean
  options?: Omit<Partial<PopperJS.Options>, 'modifiers'>
}

export const Popover: FC<Popover> = ({ button, panel, hover, tabIndex, disableClickListener, options, ...props }) => {
  const [show, setShow] = useState(false)
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover(options)

  useEffect(() => {
    if (!document.getElementById('popover-portal')) {
      throw new Error('Please wrap your app with the ThemeProvider')
    }
  }, [])

  return (
    <HeadlessPopover {...props} as={Fragment}>
      {({ open }) => (
        <>
          {disableClickListener ? (
            <button
              tabIndex={tabIndex}
              type="button"
              ref={setReferenceElement}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              {button}
            </button>
          ) : (
            <HeadlessPopover.Button
              tabIndex={tabIndex}
              type="button"
              as="button"
              ref={setReferenceElement}
              {...(hover && { onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false) })}
            >
              {button}
            </HeadlessPopover.Button>
          )}
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
                      'rounded-lg overflow-hidden shadow-xl shadow-black/20 shadow-md'
                    ),
                  },
                  panel.props.children
                )}
              </HeadlessPopover.Panel>,
              document.body
            )}
        </>
      )}
    </HeadlessPopover>
  )
}
