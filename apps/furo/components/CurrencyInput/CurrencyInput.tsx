import { Amount, Token } from '@sushiswap/currency'
import { classNames, ERROR_INPUT_CLASSNAME, Loader, Typography } from '@sushiswap/ui'
import { FundSource } from 'hooks/useFundSourceToggler'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { FC, useRef } from 'react'

type Base = {
  amount?: string | number
  className?: string
  onChange(x: string | number): void
  error?: boolean
}

type CurrencyInputGetBalance = Base & {
  account?: string
  token?: Token
  fundSource?: FundSource
  balance?: never
  balanceLabel?: never
}
type CurrencyInputProvideBalance = Base & {
  account?: never
  token?: never
  fundSource?: never
  balance?: Amount<Token>
  balanceLabel?: string
}

type CurrencyInput = CurrencyInputGetBalance | CurrencyInputProvideBalance

const CurrencyInput: FC<CurrencyInput> = ({
  amount,
  onChange,
  account,
  token,
  className = '',
  fundSource = FundSource.WALLET,
  balance: providedBalance,
  balanceLabel,
  error = false,
}) => {
  const amountInputRef = useRef<HTMLInputElement | null>(null)
  const { isLoading: loadingBalance, data: accountBalance } = useTokenBalance(account, token, fundSource)
  const balance = providedBalance || accountBalance

  return (
    <div
      aria-hidden="true"
      onClick={() => amountInputRef.current?.focus()}
      className={classNames(
        className,
        error ? ERROR_INPUT_CLASSNAME : '',
        'flex flex-col rounded-xl bg-slate-800 focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue',
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <input
          ref={amountInputRef}
          value={amount}
          type="text"
          placeholder="0.00"
          className="px-4 text-left shadow-none border-none text-lg font-bold bg-transparent !ring-0 shadow-none"
          onChange={(e) => onChange(e.target.value)}
        />
        <Typography variant="sm" weight={700} className="pr-4 text-slate-500">
          {token?.symbol}
        </Typography>
      </div>
      <div className="flex justify-between px-4 pb-3">
        <Typography variant="xs" weight={500} className="text-slate-500">
          {balanceLabel || 'Balance'}
        </Typography>
        {loadingBalance ? (
          <Loader size="12px" />
        ) : (
          <Typography
            variant="xs"
            weight={500}
            className="text-slate-500"
            onClick={() => (balance ? onChange(balance?.toExact()) : undefined)}
          >
            {balance?.toSignificant(6)} {balance?.currency.symbol}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default CurrencyInput
