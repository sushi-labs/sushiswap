'use client'

import { type FunkitCheckoutConfig, useFunkitCheckout } from '@funkit/connect'
import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button } from '@sushiswap/ui'
import { useAccount } from 'wagmi'
import { useGetTokenAmount } from '../../../lib/hooks/useGetTokenAmount'
import { useDerivedStateFiat } from './derivedstate-fiat-provider'

export const FiatPurchaseButton = () => {
  const {
    state: { swapAmountString, token0, token1, chainId: __, paymentType },
  } = useDerivedStateFiat()

  const { isDisconnected } = useAccount()

  const { tokenAmount, netFiatAmount: _ } = useGetTokenAmount({
    countryCode: token0?.code,
    sourceCurrencyCode: token0?.symbol || 'USD',
    amount: swapAmountString ? Number(swapAmountString) : undefined,
    destinationTokenSymbol: token1?.symbol,
    paymentMethodType: paymentType === 'apple-pay' ? 'APPLE_PAY' : 'CARD',
  })

  const { beginCheckout } = useFunkitCheckout({
    config: {
      modalTitle: token1?.symbol ? `Buy ${token1.symbol}` : 'Buy',
      targetAssetAmount: Number(tokenAmount || 0),
      targetChain: Number(token1?.chainId),
      targetAsset: token1?.wrapped.address || '',
      targetAssetTicker: token1?.symbol || 'TOKEN',
      checkoutItemTitle: token1?.symbol || 'TOKEN',
      expirationTimestampMs: 30 * 60 * 1000,
      iconSrc: '',
      isDefiMode: true,
      isHidden: false,
    } satisfies FunkitCheckoutConfig,
  })

  return (
    <Button
      size="xl"
      fullWidth
      testId="swap"
      onClick={async () => await beginCheckout()}
      disabled={!swapAmountString || swapAmountString === '0' || isDisconnected}
      icon={!swapAmountString ? undefined : ExternalLinkIcon}
      iconPosition="end"
    >
      {!swapAmountString ? 'Enter Amount' : 'Confirm Purchase'}
    </Button>
  )
}
