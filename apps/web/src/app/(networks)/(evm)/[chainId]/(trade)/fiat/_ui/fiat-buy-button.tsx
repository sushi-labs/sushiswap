'use client'

import { Button, DialogTrigger } from '@sushiswap/ui'
import {
  isCrossmintConfiguredTokenChainId,
  useFiatExchangeRates,
} from 'src/lib/crossmint'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { useDerivedStateFiatBuy } from './derivedstate-fiat-buy-provider'
import { FiatBuyReviewDialog } from './fiat-buy-review-dialog'

export function FiatBuyButton() {
  const {
    state: { fiatAmountString, paymentCurrency, token },
  } = useDerivedStateFiatBuy()
  const exchangeRates = useFiatExchangeRates({
    enabled: paymentCurrency !== 'usd',
  })
  const tokenChainId = token?.token.chainId
  const fiatAmount = Number(fiatAmountString)
  const hasAmount = Number.isFinite(fiatAmount) && fiatAmount > 0
  const exchangeRate =
    paymentCurrency === 'usd' ? 1 : exchangeRates.data?.rates[paymentCurrency]
  const amountUsd = exchangeRate ? fiatAmount / exchangeRate : undefined
  const meetsMinimumBuyAmount =
    amountUsd !== undefined && Number.isFinite(amountUsd) && amountUsd >= 1
  const isConfiguredToken = token
    ? isCrossmintConfiguredTokenChainId(token.token.chainId)
    : false
  const supportsCardPayments = Boolean(token?.features.creditCardPayment)

  return (
    <FiatBuyReviewDialog>
      <Checker.Connect
        namespace={
          tokenChainId ? getNamespaceForChainId(tokenChainId) : undefined
        }
      >
        <Checker.Custom
          showChildren={Boolean(token)}
          buttonText="Select a token"
          onClick={() => {}}
          disabled
        >
          <Checker.Custom
            showChildren={isConfiguredToken}
            buttonText="Checkout unavailable on this network"
            onClick={() => {}}
            disabled
          >
            <Checker.Custom
              showChildren={supportsCardPayments}
              buttonText="Card payments unavailable"
              onClick={() => {}}
              disabled
            >
              <Checker.Network chainId={tokenChainId}>
                <Checker.Custom
                  showChildren={hasAmount}
                  buttonText="Enter an amount"
                  onClick={() => {}}
                  disabled
                >
                  <Checker.Custom
                    showChildren={meetsMinimumBuyAmount}
                    buttonText="Minimum purchase is $1"
                    onClick={() => {}}
                    loading={
                      hasAmount &&
                      paymentCurrency !== 'usd' &&
                      exchangeRates.isLoading
                    }
                    disabled
                  >
                    <DialogTrigger asChild>
                      <Button type="button" fullWidth size="xl">
                        Review purchase
                      </Button>
                    </DialogTrigger>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Network>
            </Checker.Custom>
          </Checker.Custom>
        </Checker.Custom>
      </Checker.Connect>
    </FiatBuyReviewDialog>
  )
}
