import React, { FC, ReactElement, useCallback, useRef } from 'react'
import { usePopoverContext } from './PopoverProvider'

export interface PopoverButtonInterface {
  children: ReactElement
}

export const PopoverButton: FC<PopoverButtonInterface> = ({ children }) => {
  const { setReferenceElement, setHovers } = usePopoverContext()
  const timeoutId = useRef<NodeJS.Timeout>()

  const handleButtonEnter = useCallback(() => {
    timeoutId.current = setTimeout(() => setHovers((prevState) => ({ ...prevState, button: true })), 200)
  }, [setHovers])

  const handleButtonLeave = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    setTimeout(() => setHovers((prevState) => ({ ...prevState, button: false })), 200)
  }, [setHovers])

  return React.cloneElement(children, {
    ...children.props,
    ref: setReferenceElement,
    onMouseEnter: handleButtonEnter,
    onMouseLeave: handleButtonLeave,
  })
}
