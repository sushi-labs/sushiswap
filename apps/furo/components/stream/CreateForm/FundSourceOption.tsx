import { CheckCircleIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_BG, Typography } from '@sushiswap/ui'
import { _useBalance as useBalance } from '@sushiswap/wagmi'
import { FC } from 'react'
import { useAccount } from '@sushiswap/wagmi'

interface FundSourceOption {
  chainId: ChainId
  label: string
  active: boolean
  value: FundSource | undefined
  currency: Type | undefined
  onChange(): void
}

export const FundSourceOption: FC<FundSourceOption> = ({ chainId, label, active, value, onChange, currency }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { data: balance } = useBalance({
    account: address,
    currency,
    chainId,
    loadBentobox: true,
    enabled: Boolean(isMounted && currency && chainId && address),
  })

  return (
    <button
      type="button"
      onClick={onChange}
      className={classNames(
        active ? 'ring-green/70' : 'ring-transparent',
        DEFAULT_INPUT_BG,
        'text-left ring-2 ring-offset-2 ring-offset-slate-900 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
      )}
    >
      <Typography weight={600} className="text-slate-50">
        {label}
      </Typography>
      <div className="flex flex-col">
        <Typography variant="xs" className="text-slate-400">
          Available Balance
        </Typography>
        <Typography weight={500} variant="xs" className="text-slate-400">
          {isMounted ? (
            <>
              {balance && value ? balance[value].toSignificant(6) : '0.00'}{' '}
              <span className="text-slate-500">{value && balance?.[value]?.currency.symbol}</span>
            </>
          ) : (
            <div className="h-4" />
          )}
        </Typography>
      </div>
      {active && (
        <div className="absolute w-5 h-5 top-3 right-3">
          <CheckCircleIcon className="text-green/70" />
        </div>
      )}
    </button>
  )
}
