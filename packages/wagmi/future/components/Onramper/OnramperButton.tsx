import React, { FC, ReactNode, useCallback } from 'react'

import { useOnramperContext } from './OnramperProvider'

export const OnramperButton: FC<{ children: ReactNode }> = ({ children }) => {
  const { setOpen } = useOnramperContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return <button onClick={onClick}>{children}</button>
}
