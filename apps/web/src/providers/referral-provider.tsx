'use client'

import { acceptReferral } from '@sushiswap/graph-client/leaderboard'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { type GetAccountReturnType, watchAccount } from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { ChainId } from 'sushi'
import { isEvmAddress } from 'sushi/evm'
import { useConfig, useSignMessage } from 'wagmi'
interface ReferralProviderProps {
  children: React.ReactNode
}

// const isProduction =
//   process.env.NODE_ENV === 'production' &&
//   process.env.NEXT_PUBLIC_APP_ENV !== 'test'
const isProduction = true

export const ReferralProvider: FC<ReferralProviderProps> = ({ children }) => {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referrer')
  return isProduction && referralCode ? (
    <_ReferralProvider>{children}</_ReferralProvider>
  ) : (
    <>{children}</>
  )
}

const _ReferralProvider: FC<ReferralProviderProps> = ({ children }) => {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referrer')

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
      if (!referralCode || !isEvmAddress(referralCode)) {
        return
      }

      try {
        const message = `I accept referral code: ${referralCode}`

        const signature = await signMessageAsync({ message })
        const res = await acceptReferral({
          referralCode: referralCode,
          message,
          signature,
          userAddress: data.address,
        })
        const ts = Date.now()
        if (res.success) {
          createSuccessToast({
            summary: res?.message || 'Referral accepted successfully',
            account: data.address,
            type: 'send',
            chainId: data?.chainId as ChainId,
            groupTimestamp: ts,
            timestamp: ts,
          })
        } else {
          createFailedToast({
            summary: res?.message || 'Failed to accept referral',
            account: data.address,
            type: 'send',
            chainId: data?.chainId as ChainId,
            groupTimestamp: ts,
            timestamp: ts,
          })
        }
        console.log('Referral res:', res)
      } catch (error) {
        //todo: handle error properly
        console.error('Error during account connection:', error)
      }
    }

    return watchAccount(config, {
      onChange: handleAccountChange,
    })
  }, [signMessageAsync, config, referralCode])

  return <>{children}</>
}
