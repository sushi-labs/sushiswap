import { useState } from 'react'
import { usePopper } from 'react-popper'

type UsePopover = () => ReturnType<typeof usePopper> & {
  setReferenceElement: any
  setPopperElement: any
  setArrowElement: any
}

export const usePopover: UsePopover = () => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'auto-start',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement, padding: 8 } },
      { name: 'flip', enabled: true, options: { padding: 8 } },
      { name: 'offset', options: { offset: [-12, 14] } },
    ],
  })

  return {
    ...popper,
    setReferenceElement: setReferenceElement as any,
    setPopperElement: setPopperElement as any,
    setArrowElement: setArrowElement as any,
  }
}
