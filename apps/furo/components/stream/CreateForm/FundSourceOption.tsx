import { CheckCircleIcon } from '@heroicons/react/solid'
import { ChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import { FC } from 'react'

interface FundSourceOption {
  chainId: ChainId
  label: string
  active: boolean
  value: FundSource | undefined
  currency: Type | undefined
  onChange(): void
}

export const FundSourceOption: FC<FundSourceOption> = ({
  chainId,
  label,
  active,
  value,
  onChange,
  currency,
}) => {
  const { address } = useAccount()
  const { data: balance } = useBalance({
    account: address,
    currency,
    chainId,
    loadBentobox: true,
    enabled: Boolean(currency && chainId && address),
  })

  return (
    <div
      role="button"
      onClick={onChange}
      className={classNames(
        active
          ? 'ring-blue bg-blue/20'
          : 'ring-transparent bg-black/[0.04] dark:bg-white/[0.04]',
        'ring-2 text-left rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]',
      )}
    >
      <span className="dark:text-slate-50">{label}</span>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase text-gray-600 dark:text-slate-400">
          Balance
        </span>
        <span className="text-sm font-medium">
          {balance && value ? balance[value].toSignificant(6) : '0.00'}{' '}
          {value && balance?.[value]?.currency.symbol}
        </span>
      </div>
      {active && (
        <div className="absolute w-5 h-5 top-3 right-3">
          <CheckCircleIcon className="text-blue" />
        </div>
      )}
    </div>
  )
}
