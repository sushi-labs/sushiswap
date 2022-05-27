import { ChevronDownIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames, Input, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { Theme } from '../types'
import { NetworkSelector } from './NetworkSelector'
import { TokenSelector } from './TokenSelector'

interface CurrencyInputBase {
  type: 'AMOUNT_IN' | 'AMOUNT_OUT'
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

type CurrencyInputChain = CurrencyInputSingleChain | CurrencyInputMultiChain
type CurrencyInputTokenSelect = CurrencyInputEnableTokenSelect | CurrencyInputDisableTokenSelect
type CurrencyInput = CurrencyInputBase & CurrencyInputChain & CurrencyInputTokenSelect

const CurrencyInput: FC<CurrencyInput> = ({
  type,
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
  theme,
}) => {
  const [networkSelectorOpen, setNetworkSelectorOpen] = useState(false)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          {!disableNetworkSelect && (
            <button
              className={classNames(
                theme.secondary.default,
                theme.secondary.hover,
                `relative flex items-center gap-1 py-1 text-xs font-bold `
              )}
              onClick={() => setNetworkSelectorOpen(true)}
            >
              {network.name} <ChevronDownIcon width={16} height={16} />
            </button>
          )}
          <div className={classNames(theme.secondary.default, 'flex items-center gap-2 text-xs')}>
            Receive in
            <div
              className={classNames(
                type === 'AMOUNT_IN' ? theme.background.secondary : theme.background.primary,
                'cursor-pointer flex gap-2 px-2 py-1 rounded-full'
              )}
            >
              <span
                onClick={() => onFundSourceSelect(FundSource.WALLET)}
                className={classNames(
                  fundSource === FundSource.BENTOBOX
                    ? theme.secondary
                    : classNames(theme.primary.default, theme.primary.hover, 'font-bold')
                )}
              >
                Wallet
              </span>
              <span
                onClick={() => onFundSourceSelect(FundSource.BENTOBOX)}
                className={classNames(
                  fundSource === FundSource.BENTOBOX
                    ? classNames(theme.primary.default, theme.primary.hover, 'font-bold')
                    : theme.secondary
                )}
              >
                BentoBox
              </span>{' '}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative flex items-center">
            <Input.Numeric
              disabled={disabled}
              onUserInput={onChange}
              className={classNames(
                theme.primary.default,
                theme.primary.hover,
                'flex-auto w-full px-0 py-1 overflow-hidden text-2xl font-bold bg-transparent border-none shadow-none outline-none focus:ring-0 overflow-ellipsis disabled:cursor-not-allowed'
              )}
              value={value}
              readOnly={disabled}
            />
            <button
              onClick={() => setTokenSelectorOpen(true)}
              className={classNames(
                theme.primary.default,
                theme.primary.hover,
                'flex items-center gap-1 py-1 text-lg font-bold '
              )}
            >
              {currency.symbol} <ChevronDownIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between pb-3">
        <Typography
          variant="xs"
          className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 select-none ')}
        >
          {value && '$0.00'}
        </Typography>
        <button className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 text-xs ')}>MAX</button>
      </div>
      {!disableNetworkSelect && onNetworkSelect && (
        <NetworkSelector
          open={networkSelectorOpen}
          onClose={() => setNetworkSelectorOpen(false)}
          onSelect={onNetworkSelect}
          selected={network.chainId}
          theme={theme}
        />
      )}
      {!disableCurrencySelect && onCurrencySelect && (
        <TokenSelector
          tokenMap={tokenList}
          onClose={() => setTokenSelectorOpen(false)}
          chainId={network.chainId}
          open={tokenSelectorOpen}
          currency={currency}
          onSelect={onCurrencySelect}
          theme={theme}
        />
      )}
    </>
  )
}

export default CurrencyInput
