import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Percent, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import NumericalInput from 'app/components/Input/Numeric'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { classNames, formatNumber, maxAmountSpend, tryParseAmount, warningSeverity } from 'app/functions'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import BentoBoxFundingSourceModal from '../add/BentoBoxFundingSourceModal'

interface SwapAssetPanel {
  ref?: ForwardedRef<HTMLInputElement>
  error?: boolean
  // @ts-ignore TYPE NEEDS FIXING
  header: (x) => React.ReactNode
  // @ts-ignore TYPE NEEDS FIXING
  walletToggle?: (x) => React.ReactNode
  currency?: Currency
  currencies?: string[]
  value?: string
  onChange(x?: string): void
  onSelect?(x: Currency): void
  spendFromWallet?: boolean
  selected?: boolean
  priceImpact?: Percent
  priceImpactCss?: string
  inputDisabled?: boolean
  disabled?: boolean
  balancePanel?: (x: Pick<SwapAssetPanel, 'disabled' | 'currency' | 'onChange' | 'spendFromWallet'>) => React.ReactNode
  hideInput?: boolean
}

const SwapAssetPanel: FC<SwapAssetPanel> = forwardRef<HTMLInputElement, SwapAssetPanel>(
  (
    {
      error,
      header,
      walletToggle,
      currency,
      value,
      onChange,
      selected,
      onSelect,
      spendFromWallet,
      priceImpact,
      priceImpactCss,
      disabled,
      inputDisabled,
      currencies,
      balancePanel,
      hideInput,
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          disabled ? 'pointer-events-none opacity-40' : '',
          error ? 'border-red-800 hover:border-red-500' : 'border-dark-700 hover:border-dark-600',
          'rounded-[14px] border bg-dark-900 p-3 flex flex-col gap-4'
        )}
      >
        {header({
          disabled,
          onChange,
          value,
          currency,
          currencies,
          onSelect,
          walletToggle,
          spendFromWallet,
        })}
        {!hideInput && (
          <div className="flex gap-1 justify-between items-baseline px-1.5">
            <InputPanel
              {...{
                ref,
                selected,
                error,
                currency,
                currencies,
                value,
                onChange,
                inputDisabled,
                onSelect,
                priceImpact,
                priceImpactCss,
                spendFromWallet,
              }}
            />
            {balancePanel ? (
              balancePanel({ disabled, currency, onChange, spendFromWallet })
            ) : (
              <BalancePanel {...{ disabled, currency, onChange, spendFromWallet }} />
            )}
          </div>
        )}
      </div>
    )
  }
)

const WalletSwitch: FC<
  Pick<SwapAssetPanel, 'spendFromWallet' | 'disabled'> & {
    label: string
    onChange(x: boolean): void
    id?: string
  }
> = ({ label, onChange, id, spendFromWallet, disabled }) => {
  const { i18n } = useLingui()

  const content = (
    <Typography
      variant="xs"
      weight={700}
      component="span"
      className={classNames(disabled ? 'pointer-events-none opacity-40' : '', 'flex items-center gap-2 !justify-end')}
    >
      {label}
      <Typography
        id={id}
        role="button"
        onClick={() => onChange(!spendFromWallet)}
        variant="sm"
        weight={700}
        component="span"
        className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-high-emphesis hover:text-white hover:shadow bg-dark-800 hover:bg-dark-700"
      >
        {spendFromWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
      </Typography>
      <BentoBoxFundingSourceModal />
    </Typography>
  )

  if (disabled) {
    return <QuestionHelper text={i18n._(t`Not available for legacy route`)}>{content}</QuestionHelper>
  }

  return content
}

const InputPanel: FC<
  Pick<SwapAssetPanel, 'currency' | 'value' | 'onChange' | 'priceImpact' | 'inputDisabled'> & {
    priceImpactCss?: string
  }
> = forwardRef(({ currency, value, onChange, inputDisabled, priceImpact, priceImpactCss }, ref) => {
  const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency))
  const span = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState(0)

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-primary'
    if (severity < 3) return 'text-yellow'
    return 'text-red'
  }, [priceImpact])

  useEffect(() => {
    if (span.current) {
      setWidth(value ? span?.current?.clientWidth + 8 : 60)
    }
  }, [value])

  return (
    <Typography weight={700} variant="h3" className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
      <NumericalInput
        ref={ref}
        disabled={inputDisabled}
        value={value || ''}
        onUserInput={onChange}
        placeholder="0.00"
        className="leading-[36px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
        autoFocus
      />
      {!ref && (
        <>
          <Typography
            variant="xs"
            className="text-secondary absolute bottom-1.5 pointer-events-none"
            component="span"
            style={{ left: width }}
          >
            {usdcValue?.greaterThan(ZERO) && <>~{formatNumber(usdcValue?.toFixed(), true, true, 2)} </>}
            {priceImpact && (
              <span className={priceImpactClassName}>({priceImpact?.multiply(-1)?.toSignificant(2)}%)</span>
            )}
          </Typography>
          {/*This acts as a reference to get input width*/}
          <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline">
            <span ref={span} className="opacity-0 absolute pointer-events-none tracking-[0]">
              {`${value ? value : '0.00'}`}
            </span>
          </Typography>
        </>
      )}
    </Typography>
  )
})

const BalancePanel: FC<Pick<SwapAssetPanel, 'disabled' | 'currency' | 'onChange' | 'spendFromWallet'>> = ({
  disabled,
  currency,
  onChange,
  spendFromWallet,
}) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ? account : undefined, currency, spendFromWallet)

  const handleClick = useCallback(() => {
    if (disabled || !balance || !onChange) return
    onChange(maxAmountSpend(balance)?.toExact())
  }, [balance, disabled, onChange])

  return (
    <Typography role="button" onClick={handleClick} variant="sm" className="flex text-secondary whitespace-nowrap">
      {i18n._(t`Balance:`)} {balance ? balance.toSignificant(2) : '0.00'}
    </Typography>
  )
}

const SwapAssetPanelHeader: FC<
  Pick<
    SwapAssetPanel,
    'currency' | 'currencies' | 'onSelect' | 'walletToggle' | 'spendFromWallet' | 'disabled' | 'onChange' | 'value'
  > & { label: string; id?: string; selectLabel?: string; hideSearchModal?: boolean }
> = ({ label, selectLabel, walletToggle, currency, onSelect, spendFromWallet, id, currencies, hideSearchModal }) => {
  const { i18n } = useLingui()

  const trigger = currency ? (
    <div
      id={id}
      className={classNames(
        hideSearchModal ? '' : 'bg-dark-800 hover:bg-dark-700 cursor-pointer',
        'flex items-center gap-2 px-2 py-1 rounded-full shadow-md text-high-emphesis'
      )}
    >
      <CurrencyLogo currency={currency} className="!rounded-full overflow-hidden" size={20} />
      {label && (
        <Typography variant="sm" className="!text-xl" weight={700}>
          {label}
        </Typography>
      )}
      <Typography variant="sm" className="!text-xl" weight={700}>
        {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
      </Typography>
      {!hideSearchModal && <ChevronDownIcon width={18} />}
    </div>
  ) : (
    <Button color="blue" variant="filled" size="sm" id={id} className="!rounded-full !px-2 !py-0 !h-[32px] !pl-3">
      {selectLabel || i18n._(t`Select a Token`)}
      <ChevronDownIcon width={18} />
    </Button>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center">
        {!hideSearchModal ? (
          <CurrencySearchModal
            selectedCurrency={currency}
            onCurrencySelect={(currency) => onSelect && onSelect(currency)}
            trigger={trigger}
            currencyList={currencies}
          />
        ) : (
          trigger
        )}
      </div>
      {walletToggle && walletToggle({ spendFromWallet })}
    </div>
  )
}

export default Object.assign(SwapAssetPanel, { Header: SwapAssetPanelHeader, Switch: WalletSwitch })
