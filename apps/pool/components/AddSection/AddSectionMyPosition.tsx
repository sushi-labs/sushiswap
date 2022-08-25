import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { Currency, Typography } from '@sushiswap/ui'
import { useBalance } from '@sushiswap/wagmi'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface AddSectionMyPositionProps {
  pair: PairWithAlias
}

export const AddSectionMyPosition: FC<AddSectionMyPositionProps> = ({ pair }) => {
  const { address } = useAccount()

  const { token0, token1, reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId: pair.chainId, currency: liquidityToken, account: address })
  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: reserve0.wrapped,
    reserve1: reserve1.wrapped,
    totalSupply,
    balance: balance?.[FundSource.WALLET].wrapped,
  })
  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: underlying })

  return (
    <>
      <div className="p-5 pb-2 flex flex-col gap-2">
        <Typography variant="sm" weight={600} className="text-slate-50">
          My Liquidity Position
        </Typography>
        <div className="flex flex-col gap-1.5">
          <Typography variant="xs" weight={500} className="text-slate-400">
            {balance ? (
              formatUSD(Number(value0) + Number(value1))
            ) : (
              <div className="bg-slate-700 rounded-full h-[16px] my-0.5 animate-pulse w-[60px]" />
            )}
          </Typography>
          <div className="flex">
            <Currency.IconList iconWidth={16} iconHeight={16}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-400">
              {balance ? (
                <>
                  {underlying0?.toSignificant(3)} {underlying0?.currency.symbol} + {underlying1?.toSignificant(3)}{' '}
                  {underlying1?.currency.symbol}
                </>
              ) : (
                <>
                  <div className="bg-slate-700 rounded-full h-[12px] animate-pulse w-[60px]" /> +{' '}
                  <div className="bg-slate-700 rounded-full h-[12px] animate-pulse w-[60px]" />
                </>
              )}
            </Typography>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2">
        <Typography variant="sm" weight={600} className="text-slate-50">
          My Staked Position
        </Typography>
        <div className="flex flex-col gap-1.5">
          <Typography variant="xs" weight={500} className="text-slate-400">
            {balance ? (
              formatUSD(Number(value0) + Number(value1))
            ) : (
              <div className="bg-slate-700 rounded-full h-[16px] my-0.5 animate-pulse w-[60px]" />
            )}
          </Typography>
          <div className="flex">
            <Currency.IconList iconWidth={16} iconHeight={16}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-400">
              {balance ? (
                <>
                  {underlying0?.toSignificant(3)} {underlying0?.currency.symbol} + {underlying1?.toSignificant(3)}{' '}
                  {underlying1?.currency.symbol}
                </>
              ) : (
                <>
                  <div className="bg-slate-700 rounded-full h-[12px] animate-pulse w-[60px]" /> +{' '}
                  <div className="bg-slate-700 rounded-full h-[12px] animate-pulse w-[60px]" />
                </>
              )}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}
