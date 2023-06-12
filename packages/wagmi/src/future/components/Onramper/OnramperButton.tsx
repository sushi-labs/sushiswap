'use client'

import React, { FC, ReactNode, useCallback } from 'react'

import { useOnramperContext } from './OnramperProvider'

export const OnramperButton: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const { setOpen } = useOnramperContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}
