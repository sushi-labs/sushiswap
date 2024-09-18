'use client'

import { setTags, setUser } from '@sentry/nextjs'
import React, { FC } from 'react'
import { useAccountEffect } from 'wagmi'

interface WagmiSentryProps {
  children: React.ReactNode
}

// This component is used to set the Sentry tags for the current user based on the chainId and account address.
// IMPORTANT! Must be nested inside the WagmiConfig component.
export const WagmiSentry: FC<WagmiSentryProps> = ({ children }) => {
  useAccountEffect({
    onConnect(data) {
      setUser({
        id: data.address,
      })
      setTags({
        chainId: data.chainId,
        account: data.address,
      })
    },
  })
  return <>{children}</>
}
