import { usePopper } from 'react-popper'
import { useState } from 'react'

export const usePopover = () => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      { name: 'flip', enabled: true, options: { padding: 8 } },
      {
        name: 'preventOverflow',
        options: {
          padding: 8,
        },
      },
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  })

  return {
    ...popper,
    setReferenceElement,
    setPopperElement,
  }
}
