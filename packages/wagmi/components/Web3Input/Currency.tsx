import { ChevronDownIcon } from '@heroicons/react/solid'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import {
  AppearOnMount,
  classNames,
  Currency as UICurrency,
  DEFAULT_INPUT_UNSTYLED,
  Input,
  Loader,
  Typography,
} from '@sushiswap/ui'
import { FC, MouseEventHandler, useCallback, useMemo, useRef, useState } from 'react'
import { useAccount } from 'wagmi'

import { useBalance, usePrices } from '../../hooks'
import { TokenSelector, TokenSelectorProps } from '../TokenSelector'

export interface CurrencyInputProps
  extends Pick<
    TokenSelectorProps,
    'onAddToken' | 'onRemoveToken' | 'onSelect' | 'tokenMap' | 'chainId' | 'customTokenMap'
  > {
  value: string
  disabled?: boolean
  onChange(value: string): void
  currency: Type | undefined
  usdPctChange?: number
  disableMaxButton?: boolean
  className?: string
  fundSource?: FundSource
  loading?: boolean
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  onAddToken,
  onRemoveToken,
  chainId,
  tokenMap,
  customTokenMap,
  disableMaxButton = false,
  usdPctChange,
  className,
  fundSource = FundSource.WALLET,
  loading,
}) => {
  const { address } = useAccount()
  const inputRef = useRef<HTMLInputElement>(null)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const focusInput = useCallback(() => {
    if (disabled) return
    inputRef.current?.focus()
  }, [disabled])

  const handleClose = useCallback(() => {
    setTokenSelectorOpen(false)
  }, [])

  const onClick = useCallback<MouseEventHandler>(
    (e) => {
      if (!onSelect) return
      e.stopPropagation()
      setTokenSelectorOpen(true)
    },
    [onSelect]
  )

  return (
    <div className={className} onClick={focusInput}>
      <div className="relative flex items-center gap-1">
        {loading ? (
          <div className="flex flex-grow items-center h-[44px]">
            <Loader size={18} />
          </div>
        ) : (
          <Input.Numeric
            ref={inputRef}
            variant="unstyled"
            disabled={disabled}
            onUserInput={onChange}
            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-3xl py-1 text-slate-200 hover:text-slate-100')}
            value={value}
            readOnly={disabled}
          />
        )}
        <button
          onClick={onClick}
          className={classNames(
            onSelect ? 'shadow-md hover:ring-2' : 'cursor-default text-2xl',
            (currency || loading) && onSelect ? 'bg-white bg-opacity-[0.12]' : '',
            currency || loading ? 'ring-slate-500' : 'bg-blue ring-blue-700',
            'h-[36px] text-slate-200 hover:text-slate-100 transition-all flex flex-row items-center gap-1 text-xl font-semibold rounded-full px-2 py-1'
          )}
        >
          {loading ? (
            <div className="pr-12 pl-1">
              <Loader />
            </div>
          ) : currency ? (
            <>
              <div className="w-5 h-5">
                <UICurrency.Icon disableLink layout="responsive" currency={currency} width={20} height={20} />
              </div>
              <div className="ml-0.5 -mr-0.5">{currency.symbol}</div>
            </>
          ) : (
            <div className="ml-0.5 -mr-0.5 pl-1">Select</div>
          )}
          {onSelect && (
            <div className="w-5 h-5">
              <ChevronDownIcon width={20} height={20} />
            </div>
          )}
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <PricePanel value={value} currency={currency} usdPctChange={usdPctChange} />
        <div className="h-6">
          <BalancePanel
            chainId={chainId}
            account={address}
            onChange={onChange}
            currency={currency}
            fundSource={fundSource}
            disableMaxButton={disableMaxButton}
          />
        </div>
      </div>
      {onSelect && (
        <TokenSelector
          variant="dialog"
          onClose={handleClose}
          open={tokenSelectorOpen}
          fundSource={FundSource.WALLET}
          chainId={chainId}
          currency={currency}
          onSelect={onSelect}
          onAddToken={onAddToken}
          onRemoveToken={onRemoveToken}
          tokenMap={tokenMap}
          customTokenMap={customTokenMap}
        />
      )}
    </div>
  )
}

type BalancePanel = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'fundSource'
> & {
  account: string | undefined
}

const BalancePanel: FC<BalancePanel> = ({
  chainId,
  account,
  onChange,
  currency,
  disableMaxButton,
  fundSource = FundSource.WALLET,
}) => {
  const isMounted = useIsMounted()
  const { data: balance } = useBalance({
    chainId,
    currency,
    account,
    loadBentobox: fundSource !== FundSource.WALLET,
  })

  return useMemo(
    () => (
      <AppearOnMount show={!!balance}>
        <button
          type="button"
          onClick={() => onChange(balance?.[fundSource]?.greaterThan(0) ? balance[fundSource].toFixed() : '')}
          className="text-slate-400 hover:text-slate-300 py-1 text-xs"
          disabled={disableMaxButton}
        >
          {isMounted && balance ? `Balance: ${balance?.[fundSource]?.toSignificant(6)}` : ''}
        </button>
      </AppearOnMount>
    ),
    [balance, disableMaxButton, fundSource, isMounted, onChange]
  )
}

type PricePanel = Pick<CurrencyInputProps, 'currency' | 'value' | 'usdPctChange'>
const PricePanel: FC<PricePanel> = ({ currency, value, usdPctChange }) => {
  const isMounted = useIsMounted()
  const { data: tokenPrices } = usePrices({ chainId: currency?.chainId })
  const price = currency ? tokenPrices?.[currency.wrapped.address] : undefined
  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])

  return (
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
  )
}
