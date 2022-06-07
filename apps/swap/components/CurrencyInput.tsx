import { ChevronDownIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { WrappedTokenInfo } from '@sushiswap/redux-token-lists/token'
import { classNames, Input, Typography } from '@sushiswap/ui'
import { NetworkSelectorOverlay, TokenSelectorOverlay } from 'components'
import Image from 'next/image'
import { FC, useState } from 'react'

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
              {network.icon ? <Image src={network.icon} width="16px" height="16px" /> : null}
              {network.name} <ChevronDownIcon width={16} height={16} />
            </button>
          )}
          <div
            className={classNames(
              theme.secondary.default,
              theme.primary.hover,
              'flex items-center gap-2 text-xs font-bold cursor-pointer'
            )}
            onClick={() =>
              onFundSourceSelect(fundSource === FundSource.WALLET ? FundSource.BENTOBOX : FundSource.WALLET)
            }
          >
            {fundSource === FundSource.WALLET ? 'Wallet' : 'BentoBox'}
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
                'flex flex-row items-center gap-1 text-xl font-bold'
              )}
            >
              {currency.isNative ? (
                <></>
              ) : currency instanceof WrappedTokenInfo && currency.logoURI ? (
                <Image src={currency.logoURI} width="48px" height="48px" />
              ) : null}
              {currency.symbol} <ChevronDownIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Typography
          variant="xs"
          className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 select-none ')}
        >
          {value && '$0.00'}
        </Typography>
        <button className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 text-xs ')}>MAX</button>
      </div>
      {!disableNetworkSelect && onNetworkSelect && (
        <NetworkSelectorOverlay
          open={networkSelectorOpen}
          onClose={() => setNetworkSelectorOpen(false)}
          onSelect={onNetworkSelect}
          selected={network.chainId}
          theme={theme}
        />
      )}
      {!disableCurrencySelect && onCurrencySelect && (
        <TokenSelectorOverlay
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
