import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { AppearOnMount, Currency, Dialog, Typography } from '@sushiswap/ui'
import { useBalance, useFarmRewards } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'
import { StakedPositionFetcher } from '../StakedPositionFetcher'
import { PoolButtons } from './PoolButtons'

interface PoolPositionProps {
  pair: PairWithAlias
}

export const PoolPosition: FC<PoolPositionProps> = ({ pair }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const { token0, token1, reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId: pair.chainId, currency: liquidityToken, account: address })
  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0,
    reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })
  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: underlying })

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const { data: rewards } = useFarmRewards()
  const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives
  const farmId = rewards?.[pair.chainId]?.farms[pair.id]?.id
  const chefType = rewards?.[pair.chainId]?.farms[pair.id]?.chefType
    ? CHEF_TYPE_MAP[rewards?.[pair.chainId]?.farms[pair.id]?.chefType]
    : undefined

  const content = useMemo(
    () => (
      <>
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/5">
          <Typography weight={600} className="text-slate-50">
            My Position
          </Typography>
          <div className="flex flex-col">
            <Typography variant="sm" weight={600} className="text-slate-50 text-right">
              {formatUSD(Number(value0) + Number(value1))}
            </Typography>
          </div>
        </div>
        <AppearOnMount>
          <div className="flex flex-col px-5 py-4 gap-3">
            {!!incentives && (
              <div className="flex justify-between items-center mb-1">
                <Typography variant="sm" weight={600} className="text-slate-100">
                  Unstaked Position
                </Typography>
                <Typography variant="xs" weight={500} className="text-slate-100">
                  {formatUSD(Number(value0) + Number(value1))}
                </Typography>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Currency.Icon currency={token0} width={20} height={20} />
                <Typography variant="sm" weight={600} className="text-slate-300">
                  {underlying0?.toSignificant(6)} {token0.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="text-slate-400">
                {formatUSD(Number(value0))}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Currency.Icon currency={token1} width={20} height={20} />
                <Typography variant="sm" weight={600} className="text-slate-300">
                  {underlying1?.toSignificant(6)} {token1.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="text-slate-400">
                {formatUSD(Number(value1))}
              </Typography>
            </div>
          </div>
        </AppearOnMount>
        {farmId !== undefined && (
          <AppearOnMount>
            <StakedPositionFetcher
              chainId={pair.chainId}
              liquidityToken={liquidityToken}
              totalSupply={totalSupply}
              reserve0={reserve0}
              reserve1={reserve1}
              chefType={chefType}
              farmId={farmId}
            >
              {({ value0, value1, underlying1, underlying0 }) => (
                <div className="flex flex-col px-5 py-4 gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <Typography variant="sm" weight={600} className="text-slate-100">
                      Staked Position
                    </Typography>
                    <Typography variant="xs" weight={500} className="text-slate-100">
                      {formatUSD(Number(value0) + Number(value1))}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Currency.Icon currency={token0} width={20} height={20} />
                      <Typography variant="sm" weight={500} className="text-slate-300">
                        {underlying0?.toSignificant(6)} {token0.symbol}
                      </Typography>
                    </div>
                    <Typography variant="xs" weight={500} className="text-slate-400">
                      {formatUSD(Number(value0))}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Currency.Icon currency={token1} width={20} height={20} />
                      <Typography variant="sm" weight={500} className="text-slate-300">
                        {underlying1?.toSignificant(6)} {token1.symbol}
                      </Typography>
                    </div>
                    <Typography variant="xs" weight={500} className="text-slate-400">
                      {formatUSD(Number(value1))}
                    </Typography>
                  </div>
                </div>
              )}
            </StakedPositionFetcher>
          </AppearOnMount>
        )}
        <div className="flex justify-between items-center mx-5 py-4 border-t border-slate-200/5">
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
      </>
    ),
    [
      chefType,
      farmId,
      incentives,
      liquidityToken,
      pair.chainId,
      reserve0,
      reserve1,
      token0,
      token1,
      totalSupply,
      underlying0,
      underlying1,
      value0,
      value1,
    ]
  )

  return useMemo(
    () => (
      <>
        <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex bg-blue cursor-pointer rounded-full shadow-md shadow-black/50 px-6 py-3"
          >
            <Typography variant="sm" weight={600} className="text-slate-50">
              My Position
            </Typography>
          </button>
        </div>
        <Dialog onClose={handleClose} open={open}>
          <Dialog.Content className="!pb-6">
            <Dialog.Header title="My Position" onClose={handleClose} />
            <div className="flex justify-between items-center p-2 pb-3 pt-4">
              <Typography weight={600} className="text-slate-50">
                My Position
              </Typography>
              <div className="flex flex-col">
                <Typography variant="sm" weight={600} className="text-slate-50 text-right">
                  {formatUSD(Number(value0) + Number(value1))}
                </Typography>
                <Typography variant="xxs" weight={600} className="text-slate-400 text-right">
                  {balance?.[FundSource.WALLET] ? balance[FundSource.WALLET].toSignificant(6) : '0.00'} SLP
                </Typography>
              </div>
            </div>
            <div className="flex justify-between px-2 py-1">
              <div className="flex gap-2 items-center">
                <Currency.Icon currency={token0} width={20} height={20} />
                <Typography variant="sm" weight={600} className="text-slate-50">
                  {underlying0?.toSignificant(6)} {token0.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={600} className="text-slate-400">
                {formatUSD(Number(value0))}
              </Typography>
            </div>
            <div className="flex justify-between px-2 py-1">
              <div className="flex gap-2 items-center">
                <Currency.Icon currency={token1} width={20} height={20} />
                <Typography variant="sm" weight={600} className="text-slate-50">
                  {underlying1?.toSignificant(6)} {token1.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="text-slate-400">
                {formatUSD(Number(value1))}
              </Typography>
            </div>
            <div className="px-2">
              <hr className="border-t border-slate-200/10 my-3 px-2" />
            </div>
            <div className="flex justify-between items-center px-2 pt-3 pb-6">
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
            <div className="px-2 -top-1">
              <PoolButtons pair={pair} />
            </div>
          </Dialog.Content>
        </Dialog>
        <div className="hidden lg:flex bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">{content}</div>
      </>
    ),
    [balance, content, handleClose, open, pair, token0, token1, underlying0, underlying1, value0, value1]
  )
}
