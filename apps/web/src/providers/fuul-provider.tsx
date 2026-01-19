'use client'

import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { useIsMounted } from '@sushiswap/hooks'
import { watchAccount } from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { useConfig, useSignMessage } from 'wagmi'

interface FuulProviderProps {
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

const message = 'Confirm to track your referrals and earn points!'

export const FuulProvider: FC<FuulProviderProps> = ({ children }) => {
  const searchParams = useSearchParams()
  const isAffiliateURL = searchParams.has('af') // 'af' is the affiliate code param

  return isAffiliateURL && isProduction ? (
    <_FuulProvider>{children}</_FuulProvider>
  ) : (
    <>{children}</>
  )
}

const _FuulProvider: FC<FuulProviderProps> = ({ children }) => {
  const isMounted = useIsMounted()
  const searchParams = useSearchParams()
  const affiliateCode = searchParams.get('af') // 'af' is the affiliate code param

  useEffect(() => {
    if (isMounted) {
      Fuul.sendPageview()
    }
  }, [isMounted])

  const { signMessageAsync } = useSignMessage()
  const config = useConfig()

  useEffect(() => {
    return watchAccount(config, {
      onChange(data, prevData) {
        if (
          data.status === 'connected' &&
          (prevData.address !== data.address || prevData.status !== 'connected')
        ) {
          signMessageAsync({
            message,
          })
            .then((signature) => {
              //todo: Verify signature to get the public key
              Fuul.identifyUser({
                identifier: data.address,
                identifierType: UserIdentifierType.EvmAddress,
                signature,
                message,
              })
            })
            .then(() => {
              if (affiliateCode) {
                const affiliateCodeMessage = `I am using invite code ${affiliateCode}`
                signMessageAsync({
                  message: affiliateCodeMessage,
                }).then((signature) => {
                  //todo: Verify signature to get the public key
                  Fuul.useReferralCode({
                    code: affiliateCode,
                    user_identifier: data.address,
                    user_identifier_type: UserIdentifierType.EvmAddress,
                    signature,
                    signature_message: affiliateCodeMessage,
                  })
                })
              }
            })
        }
      },
    })
  }, [signMessageAsync, config, affiliateCode])

  return <>{children}</>
}
