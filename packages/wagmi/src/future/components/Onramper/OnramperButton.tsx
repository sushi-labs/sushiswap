'use client'

import React, { FC, ReactNode, useCallback } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { useOnramperContext } from './OnramperProvider'

export const OnramperButton: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const { setOpen } = useOnramperContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Slot onClick={onClick} className={className}>
      {children}
    </Slot>
  )
}
