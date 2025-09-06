'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Badge,
  Button,
  SelectIcon,
  SelectPrimitive,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { SkeletonBox } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { Amount, type Percent } from 'sushi'
import type { EvmChainId, EvmCurrency, EvmToken } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { QuickSelect } from '../../token-selector/quick-select/quick-select'
import { TokenSelectorV2 } from '../../token-selector/token-selector-v2'
import { BalancePanel } from './BalancePanel'
import { PercentageInputs } from './PercentageInputs'
import { PricePanel } from './PricePanel'

interface CurrencyInputProps {
  id?: string
  disabled?: boolean
  value: string
  onChange?(value: string): void
  currency: EvmCurrency | undefined
  onSelect?(currency: EvmCurrency): void
  chainId: EvmChainId
  currencyClassName?: string
  className?: string
  loading?: boolean
  priceImpact?: Percent | undefined
  disableMaxButton?: boolean
  type: 'INPUT' | 'OUTPUT'
  fetching?: boolean
  currencyLoading?: boolean
  currencies?: Record<string, EvmToken>
  allowNative?: boolean
  error?: string
  hidePinnedTokens?: boolean
  disableInsufficientBalanceError?: boolean
  hidePricing?: boolean
  hideIcon?: boolean
  label?: string
  networks?: readonly EvmChainId[]
  selectedNetwork?: EvmChainId
  onNetworkChange?: (network: number) => void
  showQuickSelect?: boolean
  hideInputAndPricing?: boolean
  isTwap?: boolean
  hidePercentageInputs?: boolean
}

const CurrencyInput: FC<CurrencyInputProps> = ({
  id,
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  chainId,
  currencyClassName,
  className,
  loading,
  priceImpact,
  disableMaxButton = false,
  type,
  fetching,
  currencyLoading,
  currencies,
  allowNative = true,
  error,
  hidePinnedTokens = false,
  disableInsufficientBalanceError = false,
  hidePricing = false,
  hideIcon = false,
  label,
  networks,
  selectedNetwork,
  onNetworkChange,
  showQuickSelect,
  hideInputAndPricing,
  isTwap,
  hidePercentageInputs,
}) => {
  const isMounted = useIsMounted()

  const [localValue, setLocalValue] = useState<string>('')
  const { address } = useAccount()
  const [pending, startTransition] = useTransition()

  const { data: balance, isLoading: isBalanceLoading } =
    useAmountBalance(currency)

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrap().address,
    enabled: !hidePricing,
  })

  const _value = useMemo(
    () => currency && Amount.tryFromHuman(currency, value),
    [value, currency],
  )
  const insufficientBalance =
    address &&
    type === 'INPUT' &&
    balance &&
    _value &&
    balance.lt(_value) &&
    !disableInsufficientBalanceError

  // If currency changes, trim input to decimals
  useEffect(() => {
    if (currency && onChange && value && value.includes('.')) {
      const [, decimals] = value.split('.')
      if (decimals.length > currency.decimals) {
        onChange(Number(value).toFixed(currency.decimals))
      }
    }
  }, [onChange, currency, value])

  const isLoading = !isMounted || loading || currencyLoading || isBalanceLoading
  const _error = error
    ? error
    : insufficientBalance
      ? 'Exceeds Balance'
      : undefined

  const _onChange = useCallback(
    (value: string) => {
      setLocalValue(value)
      startTransition(() => {
        onChange?.(value)
      })
    },
    [onChange],
  )

  useEffect(() => {
    if (currency && chainId && currency?.chainId !== chainId) {
      console.error(
        `Selected token chainId not equal to passed chainId, impossible state. Currency chainId: ${currency.chainId}, chainId: ${chainId}`,
      )
    }
  }, [currency, chainId])

  const selector = useMemo(() => {
    if (!onSelect) return null

    return (
      <div
        className={classNames(
          'flex items-center gap-1 md:gap-2',
          hideInputAndPricing && 'justify-between w-full sm:w-fit',
          showQuickSelect && '!justify-end !sm:w-fit',
        )}
      >
        {showQuickSelect ? <QuickSelect type={type} /> : null}

        <TokenSelectorV2
          currencies={currencies}
          selected={currency}
          onSelect={onSelect}
          includeNative={allowNative}
          hidePinnedTokens={hidePinnedTokens}
          selectedNetwork={selectedNetwork}
          type={type === 'OUTPUT' ? 'buy' : 'sell'}
          onNetworkSelect={onNetworkChange}
          isTwap={isTwap}
        >
          <Button
            data-state={currencyLoading ? 'inactive' : 'active'}
            size="lg"
            variant={currency ? 'secondary' : 'default'}
            id={id}
            type="button"
            className={classNames(
              currency ? 'pl-1.5 pr-3' : '',
              networks ? '!h-11' : '',
              currencyClassName,
              '!rounded-full h-[48px] data-[state=inactive]:hidden data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
            )}
          >
            {currency ? (
              networks ? (
                <>
                  <div className="w-[37px] h-[37px] mr-0.5">
                    <Badge
                      className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11] !-right-[15%] bottom-[3%]"
                      position="bottom-right"
                      badgeContent={
                        <NetworkIcon
                          type="square"
                          className="rounded-[3px]"
                          chainId={currency.chainId}
                          width={15}
                          height={15}
                        />
                      }
                    >
                      <Currency.Icon
                        disableLink
                        currency={currency}
                        width={37}
                        height={37}
                      />
                    </Badge>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm md:text-xl leading-5">
                      {currency.symbol}
                    </span>
                  </div>
                  <SelectPrimitive.Icon asChild>
                    <ChevronRightIcon strokeWidth={2} width={16} height={16} />
                  </SelectPrimitive.Icon>
                </>
              ) : (
                <>
                  <div className="w-[37px] h-[37px] mr-0.5">
                    <Badge
                      className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11] !-right-[15%] bottom-[3%]"
                      position="bottom-right"
                      badgeContent={
                        <NetworkIcon
                          type="square"
                          className="rounded-[3px]"
                          chainId={currency.chainId}
                          width={15}
                          height={15}
                        />
                      }
                    >
                      <Currency.Icon
                        disableLink
                        currency={currency}
                        width={37}
                        height={37}
                      />
                    </Badge>
                  </div>
                  <span className="text-sm md:text-xl">{currency.symbol}</span>
                  <SelectIcon />
                </>
              )
            ) : (
              'Select token'
            )}
          </Button>
        </TokenSelectorV2>
      </div>
    )
  }, [
    currencyClassName,
    currencyLoading,
    id,
    onSelect,
    currencies,
    currency,
    allowNative,
    hidePinnedTokens,
    networks,
    selectedNetwork,
    onNetworkChange,
    showQuickSelect,
    hideInputAndPricing,
    type,
    isTwap,
  ])

  return (
    <div
      className={classNames(
        _error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative overflow-hidden',
        className,
      )}
    >
      <div
        data-state={fetching ? 'active' : 'inactive'}
        className="transition-all data-[state=inactive]:hidden data-[state=active]:block absolute inset-0 overflow-hidden p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-gradient-to-r before:from-transparent dark:before:via-slate-50/10 before:via-gray-900/[0.07] before:to-transparent"
      />
      <div className="flex items-center justify-between">
        {label ? (
          <span className="text-sm text-muted-foreground">{label}</span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4 justify-end">
          {type === 'INPUT' && !hidePercentageInputs ? (
            <PercentageInputs
              loading={isBalanceLoading}
              chainId={chainId}
              account={address}
              onChange={onChange}
              currency={currency}
              disableMaxButton={disableMaxButton}
              balance={balance}
            />
          ) : null}
          <BalancePanel
            id={id}
            loading={isBalanceLoading}
            chainId={chainId}
            account={address}
            onChange={onChange}
            currency={currency}
            disableMaxButton={disableMaxButton}
            balance={balance}
            type={type}
          />
        </div>
      </div>
      <div className="relative flex items-center gap-2 md:gap-4 mt-1">
        {hideInputAndPricing ? null : (
          <div className="w-full">
            <div
              data-state={isLoading ? 'active' : 'inactive'}
              className={classNames(
                'data-[state=inactive]:hidden data-[state=active]:flex',
                'gap-4 items-center justify-between flex-grow h-[40px]',
              )}
            >
              <SkeletonBox className="w-2/3 h-[28px] rounded-lg" />
              {currencyLoading ? (
                <SkeletonBox className="w-1/3 h-[28px] rounded-lg" />
              ) : null}
            </div>
            <div
              data-state={isLoading ? 'inactive' : 'active'}
              className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
            >
              <TextField
                testdata-id={`${id}-input`}
                type="number"
                variant="naked"
                disabled={disabled}
                onValueChange={_onChange}
                value={pending ? localValue : value}
                readOnly={disabled}
                maxDecimals={currency?.decimals}
                data-state={isLoading ? 'inactive' : 'active'}
                className={classNames('p-0 py-1 w-full !text-2xl font-medium')}
              />
            </div>

            {hidePricing ? (
              <div />
            ) : (
              <PricePanel
                value={value}
                currency={currency}
                priceImpact={priceImpact}
                error={_error}
                loading={isPriceLoading}
                price={price}
              />
            )}
          </div>
        )}

        {selector}
        {!onSelect ? (
          <div
            id={`${id}-button`}
            className={classNames(
              currencyClassName,
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
            )}
          >
            {currency ? (
              <>
                {!hideIcon && (
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Currency.Icon
                      disableLink
                      currency={currency}
                      width={28}
                      height={28}
                    />
                  </div>
                )}
                {currency.symbol}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { CurrencyInput, type CurrencyInputProps }
