import { useState } from 'react'
import { usePopper } from 'react-popper'

export const usePopover = (): ReturnType<typeof usePopper> => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement, padding: 8 } },
      { name: 'flip', enabled: true, options: { padding: 8 } },
      // {
      //   name: 'preventOverflow',
      //   options: {
      //     padding: 8,
      //   },
      // },
      { name: 'offset', options: { offset: [0, 14] } },
    ],
  })

  return {
    ...popper,
    setReferenceElement: setReferenceElement as any,
    setPopperElement: setPopperElement as any,
    setArrowElement: setArrowElement as any,
  }
}
