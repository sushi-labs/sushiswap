import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Currency, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, Currency as UICurrency, DEFAULT_INPUT_UNSTYLED, Input, Typography } from '@sushiswap/ui'
import { TokenSelector, usePrices } from '@sushiswap/wagmi'
import { FC, useCallback, useRef, useState } from 'react'

import { Theme } from '../../types'
import { useCustomTokens } from '../lib/state/storage'

interface CurrencyInputBase {
  value: string
  disabled?: boolean
  onChange(value: string): void
  currency: Type
  network: Chain
  tokenList: Record<string, Token>
  theme: Theme
  className?: string
  usdPctChange?: number
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
  network,
  tokenList,
  disableNetworkSelect = false,
  disableCurrencySelect = false,
  disableMaxButton = false,
  onMax,
  balance,
  theme,
  className,
  usdPctChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(network.chainId)
  const [networkSelectorOpen, setNetworkSelectorOpen] = useState(false)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)
  const { data: tokenPrices } = usePrices({ chainId: currency.chainId })
  const price = tokenPrices?.[currency.wrapped.address]
  const isMounted = useIsMounted()
  const parsedValue = tryParseAmount(value, currency)

  const focusInput = useCallback(() => {
    if (disabled) return
    inputRef.current?.focus()
  }, [disabled])

  return (
    <div className={classNames(className, 'p-3')} onClick={focusInput}>
      <div className="flex flex-col">
        {/*<div className="flex flex-row justify-between">*/}
        {/*  {!disableNetworkSelect && (*/}
        {/*    <button*/}
        {/*      type="button"*/}
        {/*      className={classNames(*/}
        {/*        theme.secondary.default,*/}
        {/*        theme.secondary.hover,*/}
        {/*        `relative flex items-center gap-1 py-1 text-xs font-medium`*/}
        {/*      )}*/}
        {/*      onClick={(e) => {*/}
        {/*        setNetworkSelectorOpen(true)*/}
        {/*        e.stopPropagation()*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <NetworkIcon chainId={network.chainId} width="16px" height="16px" className="mr-1" />*/}
        {/*      {network.name} <ChevronDownIcon width={16} height={16} />*/}
        {/*    </button>*/}
        {/*  )}*/}
        {/*</div>*/}
        <div className="flex flex-col">
          <div className="relative flex items-center gap-1">
            <Input.Numeric
              ref={inputRef}
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
              onClick={(e) => {
                setTokenSelectorOpen(true)
                e.stopPropagation()
              }}
              className={classNames(
                theme.primary.default,
                theme.primary.hover,
                'transition-all hover:ring-2 ring-slate-500 shadow-md flex flex-row items-center gap-1 text-xl font-medium bg-white bg-opacity-[0.12] rounded-full px-2 py-1'
              )}
            >
              <div className="w-5 h-5">
                <UICurrency.Icon disableLink layout="responsive" currency={currency} width={20} height={20} />
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
        <Typography variant="xs" weight={400} className="py-1 select-none text-slate-400">
          {parsedValue && price && isMounted ? `$${parsedValue.multiply(price.asFraction).toFixed(2)}` : ''}
          {usdPctChange && (
            <span
              className={classNames(
                usdPctChange === 0
                  ? ''
                  : usdPctChange > 0
                  ? 'text-green'
                  : usdPctChange < -5
                  ? 'text-red'
                  : usdPctChange < -3
                  ? 'text-yellow'
                  : 'text-slate-500'
              )}
            >
              {' '}
              {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
                usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
              }%)`}
            </span>
          )}
        </Typography>

        <div className="h-6">
          <Transition
            appear
            show={Boolean(isMounted && balance)}
            enter="transition duration-300 origin-center ease-out"
            enterFrom="transform scale-90 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <button
              type="button"
              onClick={() => {
                if (onMax && balance) {
                  onMax(balance.greaterThan(0) ? balance.toFixed() : '')
                }
              }}
              className={classNames(theme.secondary.default, theme.secondary.hover, 'py-1 text-xs')}
              disabled={disableMaxButton}
            >
              {isMounted && balance ? `Balance: ${balance.toSignificant(6)}` : ''}{' '}
            </button>
          </Transition>
        </div>
      </div>
      {/*{!disableNetworkSelect && onNetworkSelect && (*/}
      {/*  <NetworkSelectorOverlay*/}
      {/*    open={networkSelectorOpen}*/}
      {/*    onClose={() => setNetworkSelectorOpen(false)}*/}
      {/*    onSelect={onNetworkSelect}*/}
      {/*    selected={network.chainId}*/}
      {/*  />*/}
      {/*)}*/}
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
          fundSource={FundSource.WALLET}
        />
      )}
    </div>
  )
}
