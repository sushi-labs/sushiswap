import classNames from 'classnames'
import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { usePopper } from 'react-popper'

interface TooltipProps {
  children: ReactNode
  description: string
  transitionDelay?: number
  className?: string
}

export const Tooltip: FC<TooltipProps> = ({ children, description, transitionDelay = 0, className }) => {
  const [open, setOpen] = useState(false)
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  })

  useEffect(() => {
    if (open && update) {
      void update()
    }
  }, [open, update])

  const onMouseEnter = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(true), transitionDelay)
  }, [transitionDelay])

  const onMouseLeave = useCallback(() => {
    clearTimeout(timeout.current)
    setOpen(false)
  }, [])

  return (
    <>
      <div ref={setReferenceElement} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="relative z-10">
        {children}
      </div>
      {ReactDOM.createPortal(
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={classNames('', open ? '' : 'hidden', className)}
        >
          <span className="bg-gray-600 font-medium text-white px-2 py-1 rounded-xl whitespace-nowrap text-xs leading-normal">
            {description}
          </span>
        </div>,
        document.body
      )}
    </>
  )
}
