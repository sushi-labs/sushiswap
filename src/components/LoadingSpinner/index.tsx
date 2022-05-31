import React, { FC } from 'react'

export const LoadingSpinner: FC<{ active: boolean }> = ({ active }) => {
  return (
    <div
      className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue transition ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}
