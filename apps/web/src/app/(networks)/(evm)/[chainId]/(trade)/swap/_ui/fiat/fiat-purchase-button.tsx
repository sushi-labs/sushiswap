'use client'

import { type FunkitCheckoutConfig, useFunkitCheckout } from '@funkit/connect'
import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button } from '@sushiswap/ui'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useDerivedStateFiat, useFiatTrade } from './derivedstate-fiat-provider'

export const FiatPurchaseButton = () => {
  const {
    state: { swapAmountString, token1 },
  } = useDerivedStateFiat()

  const { data, isLoading } = useFiatTrade()
  const tokenAmount = data?.tokenAmount

  const { beginCheckout } = useFunkitCheckout({
    config: {
      modalTitle: token1?.symbol ? `Buy ${token1.symbol}` : 'Buy',
      targetAssetAmount: Number(tokenAmount || 0),
      targetChain: Number(token1?.chainId),
      targetAsset: token1?.wrap().address || '',
      targetAssetTicker: token1?.symbol || 'TOKEN',
      checkoutItemTitle: token1?.symbol || 'TOKEN',
      expirationTimestampMs: 30 * 60 * 1000,
      iconSrc: '',
      isDefiMode: true,
      isHidden: false,
    } satisfies FunkitCheckoutConfig,
  })

  return (
    <Checker.Connect>
      <Button
        size="xl"
        fullWidth
        testId="swap"
        onClick={async () => await beginCheckout()}
        disabled={!swapAmountString || swapAmountString === '0' || isLoading}
        icon={!swapAmountString ? undefined : ExternalLinkIcon}
        iconPosition="end"
      >
        {!swapAmountString ? 'Enter Amount' : 'Confirm Purchase'}
      </Button>
    </Checker.Connect>
  )
}
