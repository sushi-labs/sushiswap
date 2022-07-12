import { useState } from 'react'
import { usePopper } from 'react-popper'

type UsePopover = () => ReturnType<typeof usePopper> & {
  setReferenceElement: any
  setPopperElement: any
}

export const usePopover: UsePopover = () => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'auto-start',
    modifiers: [
      { name: 'flip', enabled: true, options: { padding: 8 } },
      { name: 'offset', options: { offset: [-12, 14] } },
    ],
  })

  return {
    ...popper,
    setReferenceElement: setReferenceElement as any,
    setPopperElement: setPopperElement as any,
  }
}
