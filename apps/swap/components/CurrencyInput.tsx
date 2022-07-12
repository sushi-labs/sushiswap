import { ChevronDownIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Currency, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, Input, NetworkIcon, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { TokenSelector } from '@sushiswap/wagmi'
import { usePrices } from '@sushiswap/wagmi/hooks/usePrices'
import { NetworkSelectorOverlay } from 'components'
import { FC, useState } from 'react'

import { useCustomTokens } from '../lib/state/storage'
import { Theme } from '../types'

interface CurrencyInputBase {
  value: string
  disabled?: boolean
  onChange(value: string): void
  onFundSourceSelect(source?: FundSource): void
  fundSource: FundSource
  currency: Type
  network: Chain
  tokenList: Record<string, Token>
  theme: Theme
}

type CurrencyInputDisableMaxButton = {
  disableMaxButton: true
  onMax?(value: string): void
  balance?: Amount<Currency>
}

type CurrencyInputEnableMaxButton = {
  disableMaxButton?: false
  onMax(value: string): void
  balance?: Amount<Currency>
}

type CurrencyInputEnableTokenSelect = {
  disableCurrencySelect?: false
  onCurrencySelect(currency: Type): void
}

type CurrencyInputDisableTokenSelect = {
  disableCurrencySelect: true
  onCurrencySelect?(currency: Type): void
}

type CurrencyInputMultiChain = {
  disableNetworkSelect?: false
  onNetworkSelect(network: ChainId): void
}

type CurrencyInputSingleChain = {
  disableNetworkSelect: true
  onNetworkSelect?(network: ChainId): void
}

type CurrencyInputBalance = CurrencyInputDisableMaxButton | CurrencyInputEnableMaxButton
type CurrencyInputChain = CurrencyInputSingleChain | CurrencyInputMultiChain
type CurrencyInputTokenSelect = CurrencyInputEnableTokenSelect | CurrencyInputDisableTokenSelect
type CurrencyInput = CurrencyInputBase & CurrencyInputChain & CurrencyInputTokenSelect & CurrencyInputBalance

export const CurrencyInput: FC<CurrencyInput> = ({
  disabled,
  value,
  onChange,
  currency,
  onCurrencySelect,
  onNetworkSelect,
  fundSource,
  onFundSourceSelect,
  network,
  tokenList,
  disableNetworkSelect = false,
  disableCurrencySelect = false,
  disableMaxButton = false,
  onMax,
  balance,
  theme,
}) => {
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(network.chainId)
  const [networkSelectorOpen, setNetworkSelectorOpen] = useState(false)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)
  const { data: tokenPrices } = usePrices({ chainId: currency.chainId })
  const price = tokenPrices?.[currency.wrapped.address]
  const isMounted = useIsMounted()
  const parsedValue = tryParseAmount(value, currency)

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          {!disableNetworkSelect && (
            <button
              type="button"
              className={classNames(
                theme.secondary.default,
                theme.secondary.hover,
                `relative flex items-center gap-1 py-1 text-xs font-medium`
              )}
              onClick={() => setNetworkSelectorOpen(true)}
            >
              <NetworkIcon chainId={network.chainId} width="16px" height="16px" className="mr-1" />
              {network.name} <ChevronDownIcon width={16} height={16} />
            </button>
          )}
          <button
            type="button"
            className={classNames(
              theme.secondary.default,
              theme.secondary.hover,
              'flex items-center gap-2 text-xs cursor-pointer font-medium'
            )}
            onClick={() =>
              onFundSourceSelect(fundSource === FundSource.WALLET ? FundSource.BENTOBOX : FundSource.WALLET)
            }
          >
            {fundSource === FundSource.WALLET ? 'Wallet' : 'BentoBox'}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="relative flex items-center">
            <Input.Numeric
              variant="unstyled"
              disabled={disabled}
              onUserInput={onChange}
              className={classNames(
                theme.primary.default,
                theme.primary.hover,
                DEFAULT_INPUT_UNSTYLED,
                '!text-3xl py-1'
              )}
              value={value}
              readOnly={disabled}
            />
            <button
              onClick={() => setTokenSelectorOpen(true)}
              className={classNames(
                theme.primary.default,
                theme.primary.hover,
                'flex flex-row items-center gap-1 text-xl font-medium bg-white bg-opacity-[0.12] hover:bg-opacity-[0.18] rounded-full px-2 py-0.5'
              )}
            >
              <div className="w-5 h-5">
                <Icon layout="responsive" currency={currency} width={20} height={20} />
              </div>
              <div className="ml-0.5 -mr-0.5">{currency.symbol}</div>
              <div className="w-5 h-5">
                <ChevronDownIcon width={20} height={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Typography
          variant="xs"
          className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 select-none ')}
        >
          {parsedValue && price && isMounted ? `$${parsedValue.multiply(price.asFraction).toFixed(2)}` : ''}
        </Typography>

        <button
          type="button"
          onClick={() => {
            if (onMax && balance) {
              onMax(balance.greaterThan(0) ? balance.toFixed() : '')
            }
          }}
          className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 text-xs ')}
          disabled={disableMaxButton}
        >
          Balance: {isMounted && balance ? balance.toSignificant(6) : ''}{' '}
        </button>
      </div>
      {!disableNetworkSelect && onNetworkSelect && (
        <NetworkSelectorOverlay
          open={networkSelectorOpen}
          onClose={() => setNetworkSelectorOpen(false)}
          onSelect={onNetworkSelect}
          selected={network.chainId}
        />
      )}
      {!disableCurrencySelect && onCurrencySelect && (
        <TokenSelector
          variant="dialog"
          tokenMap={tokenList}
          customTokenMap={customTokenMap}
          onClose={() => setTokenSelectorOpen(false)}
          chainId={network.chainId}
          open={tokenSelectorOpen}
          currency={currency}
          onSelect={onCurrencySelect}
          onAddToken={addCustomToken}
          onRemoveToken={removeCustomToken}
          fundSource={fundSource}
        />
      )}
    </>
  )
}
