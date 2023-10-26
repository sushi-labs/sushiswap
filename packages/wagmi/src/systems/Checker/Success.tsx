'use client'

import React, { FC, ReactNode, useEffect } from 'react'

import { useApprovedActions } from './Provider'

interface SuccessProps {
  children: ReactNode
  tag: string
}
// If this gets mounted it sets checker approved to true
const Success: FC<SuccessProps> = ({ children, tag }) => {
  const { setApproved } = useApprovedActions(tag)

  useEffect(() => {
    setApproved(true)
    return () => {
      setApproved(false)
    }
  }, [setApproved])

  return <>{children}</>
}

export { Success, type SuccessProps }
