'use client'

import { Fuul } from '@fuul/sdk'
import { useIsMounted } from '@sushiswap/hooks'
import { watchAccount } from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useConfig, useSignMessage } from 'wagmi'

interface FuulReferralProviderProps {
  children: React.ReactNode
}

const isProduction =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_APP_ENV !== 'test'

if (isProduction) {
  if (!process.env.NEXT_PUBLIC_FUUL_API_KEY) {
    throw new Error('NEXT_PUBLIC_FUUL_API_KEY is not set')
  } else {
    Fuul.init({ apiKey: process.env.NEXT_PUBLIC_FUUL_API_KEY as string })
  }
}

export const FuulReferralProvider: FC<FuulReferralProviderProps> = ({
  children,
}) => {
  return isProduction ? (
    <_FuulReferralProvider>{children}</_FuulReferralProvider>
  ) : (
    <>{children}</>
  )
}

export const _FuulReferralProvider: FC<FuulReferralProviderProps> = ({
  children,
}) => {
  const searchParams = useSearchParams()
  const isReferralURL = searchParams.has('ref')
  const isMounted = useIsMounted()

  useEffect(() => {
    if (isMounted && isReferralURL) {
      Fuul.sendPageview()
    }
  }, [isMounted, isReferralURL])

  const { signMessageAsync } = useSignMessage()
  const config = useConfig()

  useEffect(() => {
    return watchAccount(config, {
      onChange(data, prevData) {
        if (
          isReferralURL &&
          data.status === 'connected' &&
          (prevData.address !== data.address || prevData.status !== 'connected')
        ) {
          const message = `Accept affiliate on ${new Date().toString()}`

          signMessageAsync({
            message,
          }).then((signature) => {
            Fuul.sendConnectWallet({
              address: data.address,
              signature,
              message,
            })
          })
        }
      },
    })
  }, [isReferralURL, signMessageAsync, config])

  return <>{children}</>
}
