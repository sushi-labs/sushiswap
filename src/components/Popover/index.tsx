import { Popover as HeadlessuiPopover } from '@headlessui/react'
import { Placement } from '@popperjs/core'
import { classNames } from 'app/functions'
import useInterval from 'app/hooks/useInterval'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import ReactDOM from 'react-dom'
import { usePopper } from 'react-popper'

export interface PopoverProps {
  content: React.ReactNode
  children: React.ReactNode
  placement?: Placement
  show?: boolean
  modifiers?: any[]
  fullWidth?: boolean
}

export default function Popover({ content, children, placement = 'auto', show, modifiers }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: modifiers || [
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })

  const updateCallback = useCallback(() => {
    update && update()
  }, [update])

  useInterval(updateCallback, show ? 100 : null)

  // Add portal to end of page for popover
  useEffect(() => {
    if (!document.getElementById('popover-portal')) {
      const node = document.body.appendChild(document.createElement('div'))
      node.setAttribute('id', 'popover-portal')
    }
  }, [])

  return (
    <HeadlessuiPopover as={Fragment}>
      {({ open }) => (
        <>
          {React.Children.map(children, (child) => {
            return (
              <HeadlessuiPopover.Button as={Fragment} {...{ ref: setReferenceElement as any }}>
                {child}
              </HeadlessuiPopover.Button>
            )
          })}
          {(show ?? open) &&
            ReactDOM.createPortal(
              <HeadlessuiPopover.Panel
                static
                className="z-[1000] shadow-xl shadow-dark-1000/80 rounded overflow-hidden"
                ref={setPopperElement as any}
                style={styles.popper}
                {...attributes.popper}
              >
                {content}
                <div
                  className={classNames('w-2 h-2 z-50')}
                  ref={setArrowElement as any}
                  style={styles.arrow}
                  {...attributes.arrow}
                />
              </HeadlessuiPopover.Panel>,
              document.querySelector('#popover-portal') as Element
            )}
        </>
      )}
    </HeadlessuiPopover>
  )
}
