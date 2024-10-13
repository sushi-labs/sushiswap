'use client'

import { setTags, setUser } from '@sentry/nextjs'
import React, { FC, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'

interface WagmiSentryProps {
  children: React.ReactNode
}

// This component is used to set the Sentry tags for the current user based on the chainId and account address.
// IMPORTANT! Must be nested inside the WagmiConfig component.
export const WagmiSentry: FC<WagmiSentryProps> = ({ children }) => {
  const { address } = useAccount()
  const chainId = useChainId()
  useEffect(() => {
    setUser({
      id: address,
    })
    setTags({
      chainId,
      account: address,
    })
  }, [address, chainId])
  return <>{children}</>
}
