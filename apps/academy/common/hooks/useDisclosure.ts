import { useState } from 'react'

export const useDisclosure = (): { isOpen: boolean; onOpen: () => void; onClose: () => void } => {
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => {
    document.body.className = 'scroll-lock'
    setIsOpen(true)
  }
  const onClose = () => {
    document.body.className = ''
    setIsOpen(false)
  }

  return { isOpen, onOpen, onClose }
}
