'use client'

import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { useIsMounted } from '@sushiswap/hooks'
import { type GetAccountReturnType, watchAccount } from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import { useConfig, usePublicClient, useSignMessage } from 'wagmi'

interface FuulProviderProps {
  children: React.ReactNode
}

// const isProduction =
//   process.env.NODE_ENV === 'production' &&
//   process.env.NEXT_PUBLIC_APP_ENV !== 'test'
const isProduction = true
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
  const publicClient = usePublicClient()

  useEffect(() => {
    if (isMounted) {
      Fuul.sendPageview()
    }
  }, [isMounted])

  const { signMessageAsync } = useSignMessage()
  const config = useConfig()

  useEffect(() => {
    const handleAccountChange = async (
      data: GetAccountReturnType<PublicWagmiConfig>,
      prevData: GetAccountReturnType<PublicWagmiConfig>,
    ) => {
      // Only proceed if account just connected or address changed
      if (
        data.status !== 'connected' ||
        (prevData.address === data.address && prevData.status === 'connected')
      ) {
        return
      }

      try {
        const signature = await signMessageAsync({ message })

        const isValid = await publicClient.verifyMessage({
          message,
          signature,
          address: data.address,
        })

        if (!isValid) {
          throw new Error('Invalid signature')
        }

        await Fuul.identifyUser({
          identifier: data.address,
          identifierType: UserIdentifierType.EvmAddress,
          signature,
          message,
        })

        if (affiliateCode) {
          const affiliateCodeMessage = `I am using invite code ${affiliateCode}`

          const affiliateSignature = await signMessageAsync({
            message: affiliateCodeMessage,
          })

          const isAffiliateValid = await publicClient.verifyMessage({
            message: affiliateCodeMessage,
            signature: affiliateSignature,
            address: data.address,
          })

          if (!isAffiliateValid) {
            throw new Error('Invalid affiliate signature')
          }

          await Fuul.useReferralCode({
            code: affiliateCode,
            user_identifier: data.address,
            user_identifier_type: UserIdentifierType.EvmAddress,
            signature: affiliateSignature,
            signature_message: affiliateCodeMessage,
            chain_id: data.chainId,
          })
        }
      } catch (error) {
        //todo: handle error properly
        console.error('Error during account connection:', error)
      }
    }

    return watchAccount(config, {
      onChange: handleAccountChange,
    })
  }, [signMessageAsync, config, affiliateCode, publicClient])

  return <>{children}</>
}
