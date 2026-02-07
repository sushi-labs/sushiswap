'use client'

import React, { type FC, type ReactNode } from 'react'
import { SimpleSwapErrorMessage } from '../simple-swap-error-message'

export const ReviewIntro: FC<{
  renderChildren({
    error,
    isSuccess,
  }: { error: Error | null; isSuccess: boolean }): ReactNode
  swapQueryError: Error | null
  isSwapQuerySuccess: boolean
  isSwapQueryFetching: boolean
}> = ({
  renderChildren,
  swapQueryError,
  isSwapQuerySuccess,
  isSwapQueryFetching,
}) => {
  return (
    <div className="flex flex-col">
      <SimpleSwapErrorMessage
        error={swapQueryError}
        isSuccess={isSwapQuerySuccess}
        isLoading={isSwapQueryFetching}
      />
      <div className="mt-4">
        {renderChildren({
          error: swapQueryError,
          isSuccess: isSwapQuerySuccess,
        })}
      </div>
    </div>
  )
}
