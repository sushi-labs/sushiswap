'use client'

import { Message } from '@sushiswap/ui'
import { VALUE_TRANSFER_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/value-transfer/types'
import { Amount } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { useNearIntentsXSwap } from '../near-intents/xswap-provider'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { XSwapSwitchTokensButton } from '../xswap-switch-tokens-button'
import { XSwapWidgetFrame } from '../xswap-widget-frame'
import { LayerZeroTradeButton } from './trade-button'
import { LayerZeroTradeStats } from './trade-stats'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroCrossChainSwapWidget() {
  const {
    state: {
      chainId0,
      chainId1,
      token0,
      token1,
      swapAmountString,
      // isUnsupportedPair,
    },
    mutate: {
      setChainId0,
      setChainId1,
      setToken0Param,
      setToken1Param,
      setSwapAmount,
    },
    previewQuote,
    catalog,
  } = useLayerZeroXSwap()
  const { currenciesByChain } = useNearIntentsXSwap()
  const stellarCurrencies = currenciesByChain[StellarChainId.STELLAR]
  const amountOut =
    previewQuote.data && token1
      ? new Amount(token1, previewQuote.data.amountOut).toSignificant(6)
      : ''

  return (
    <XSwapWidgetFrame>
      <XSwapCurrencyInput
        id="swap-from"
        type="INPUT"
        chainId={chainId0}
        currency={token0}
        currencies={
          chainId0 === StellarChainId.STELLAR
            ? { ...stellarCurrencies, ...catalog.currenciesByChain[chainId0] }
            : undefined
        }
        onSelect={(currency) =>
          setToken0Param(
            currency.type === 'native' ? 'NATIVE' : currency.address,
          )
        }
        value={swapAmountString}
        onChange={setSwapAmount}
        allowNative
        label="Sell"
        networks={VALUE_TRANSFER_SUPPORTED_CHAIN_IDS}
        selectedNetwork={chainId0}
        onNetworkChange={setChainId0}
      />
      <XSwapSwitchTokensButton />
      <div className="flex flex-col">
        <XSwapCurrencyInput
          id="swap-to"
          type="OUTPUT"
          disabled
          chainId={chainId1}
          currency={token1}
          currencies={
            chainId1 === StellarChainId.STELLAR
              ? { ...stellarCurrencies, ...catalog.currenciesByChain[chainId1] }
              : undefined
          }
          onSelect={(currency) =>
            setToken1Param(
              currency.type === 'native' ? 'NATIVE' : currency.address,
            )
          }
          value={amountOut}
          loading={previewQuote.isLoading}
          fetching={previewQuote.isFetching}
          disableMaxButton
          allowNative
          label="Buy"
          networks={VALUE_TRANSFER_SUPPORTED_CHAIN_IDS}
          selectedNetwork={chainId1}
          onNetworkChange={setChainId1}
        />
        <LayerZeroTradeButton />
        <div className="mt-2">
          <LayerZeroTradeStats />
        </div>
      </div>
    </XSwapWidgetFrame>
  )
}
