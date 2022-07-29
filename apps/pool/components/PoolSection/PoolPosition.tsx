import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { Currency, Typography } from '@sushiswap/ui'
import { useBalance, usePrices } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface PoolPositionProps {
  pair: PairWithAlias
}

export const PoolPosition: FC<PoolPositionProps> = ({ pair }) => {
  const { address } = useAccount()
  const [token0, token1, slpToken] = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId: pair.chainId, currency: slpToken, account: address })
  const { data: prices } = usePrices({ chainId: pair.chainId })

  const [underlying0, underlying1] = useMemo(() => {
    const totalSupply = tryParseAmount(pair.totalSupply, slpToken)
    const reserve0 = tryParseAmount(pair.reserve0, token0)
    const reserve1 = tryParseAmount(pair.reserve1, token1)

    if (!balance?.[FundSource.WALLET] || !totalSupply || !reserve0 || !reserve1) {
      return [undefined, undefined]
    }

    return [
      balance[FundSource.WALLET].divide(totalSupply).multiply(reserve0),
      balance[FundSource.WALLET].divide(totalSupply).multiply(reserve1),
    ]
  }, [balance, pair.reserve0, pair.reserve1, pair.totalSupply, slpToken, token0, token1])

  const [value0, value1, valueSum] = useMemo(() => {
    const v0 = Number(underlying0?.toExact()) * Number(prices?.[token0.wrapped.address].toFixed(10))
    const v1 = Number(underlying1?.toExact()) * Number(prices?.[token1.wrapped.address].toFixed(10))
    return [v0, v1, v0 + v1]
  }, [prices, token0.wrapped.address, token1.wrapped.address, underlying0, underlying1])

  return (
    <div className="bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">
      <div className="flex justify-between items-center px-6 py-4">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-slate-50 text-right">
            {formatUSD(valueSum)}
          </Typography>
          <Typography variant="xxs" weight={600} className="text-slate-400 text-right">
            {balance?.[FundSource.WALLET] ? balance[FundSource.WALLET].toSignificant(6) : '0.00'} SLP
          </Typography>
        </div>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6 mb-0.5">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={token0} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-50">
            {underlying0?.toSignificant(6)} {token0.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={600} className="text-slate-400">
          {formatUSD(value0)}
        </Typography>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={token1} width={20} height={20} />
          <Typography variant="sm" weight={700} className="text-slate-50">
            {underlying1?.toSignificant(6)} {token1.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={500} className="text-slate-400">
          {formatUSD(value1)}
        </Typography>
      </div>
      <div className="flex justify-between items-center px-6 py-4">
        <Typography variant="xs" className="text-slate-200">
          LP Fees Earned
        </Typography>
        <div className="flex flex-col">
          <Typography variant="xs" weight={600} className="text-slate-400">
            {/*TODO*/}
            $0.00
          </Typography>
        </div>
      </div>
    </div>
  )
}
