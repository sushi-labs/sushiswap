import { Token } from '@sushiswap/currency'
import { classNames, Loader,Typography } from '@sushiswap/ui'
import { useTokenWalletBalance } from 'hooks'
import { FC, useRef } from 'react'

interface CurrencyInput {
  account?: string
  token?: Token
  amount?: string
  onChange(x: string): void
  className?: string
}

const CurrencyInput: FC<CurrencyInput> = ({ amount, onChange, account, token, className = '' }) => {
  const amountInputRef = useRef<HTMLInputElement | null>(null)
  const { isLoading: loadingBalance, data: tokenBalance } = useTokenWalletBalance(account, token)

  return (
    <div
      aria-hidden="true"
      onClick={() => amountInputRef.current?.focus()}
      className={classNames(
        className,
        'flex flex-col rounded-xl bg-slate-800 focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue shadow-md',
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <input
          ref={amountInputRef}
          value={amount}
          type="text"
          placeholder="0.00"
          className="px-4 text-left shadow-md border-none text-lg font-bold bg-transparent !ring-0 shadow-none"
          onChange={(e) => onChange(e.target.value)}
        />
        <Typography variant="sm" weight={700} className="pr-4 text-slate-500">
          {token?.symbol}
        </Typography>
      </div>
      <div className="flex justify-between px-4 pb-3">
        <Typography variant="xs" weight={500} className="text-slate-500">
          Balance
        </Typography>
        {loadingBalance ? (
          <Loader size="12px" />
        ) : (
          <Typography
            variant="xs"
            weight={500}
            className="text-slate-500"
            onClick={() => (tokenBalance ? onChange(tokenBalance?.toExact()) : undefined)}
          >
            {tokenBalance?.toSignificant(6)} {tokenBalance?.currency.symbol}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default CurrencyInput
