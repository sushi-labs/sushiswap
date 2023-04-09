import { formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { FundSource } from '@sushiswap/hooks'
import { Currency, Dialog, Typography } from '@sushiswap/ui'
import { FC, useCallback } from 'react'

import { useTokensFromPool } from '../../../lib/hooks'
import { usePoolPosition } from '../../PoolPositionProvider'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'
import { PoolButtons } from '../PoolButtons'

interface PoolActionBarPositionDialogProps {
  pool: Pool
  open: boolean
  setOpen(open: boolean): void
}

export const PoolActionBarPositionDialog: FC<PoolActionBarPositionDialogProps> = ({ pool, open, setOpen }) => {
  const { token0, token1 } = useTokensFromPool(pool)
  const { balance, isError, isLoading, value0, value1, underlying1, underlying0 } = usePoolPosition()
  const {
    balance: stakedBalance,
    value0: stakedValue0,
    value1: stakedValue1,
    underlying0: stakedUnderlying0,
    underlying1: stakedUnderlying1,
    isLoading: isStakedLoading,
    isError: isStakedError,
  } = usePoolPositionStaked()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog onClose={handleClose} open={open}>
      <Dialog.Content className="!pb-6">
        <Dialog.Header title="My Position" onClose={handleClose} />
        {isLoading && !isError && !balance?.[FundSource.WALLET] ? (
          <div className="flex flex-col gap-2 px-2 py-4 mt-2">
            <div className="grid justify-between grid-cols-10 gap-10 mb-2">
              <div className="h-[20px] bg-slate-600 animate-pulse col-span-8 rounded-full" />
              <div className="h-[20px] bg-slate-600 animate-pulse col-span-2 rounded-full" />
            </div>
            <div className="grid justify-between grid-cols-10 gap-10">
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
            </div>
            <div className="grid justify-between grid-cols-10 gap-10">
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-2 pt-4">
              <Typography variant="sm" weight={600} className="text-slate-100">
                My Position
              </Typography>
              <div className="flex flex-col">
                <Typography variant="xs" weight={500} className="text-right text-slate-100">
                  {formatUSD(value0 + value1)}
                </Typography>
              </div>
            </div>
            <div className="flex justify-between px-2 py-1">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={token0} width={20} height={20} />
                <Typography variant="sm" weight={500} className="text-slate-300">
                  {underlying0?.toSignificant(6)} {token0.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
                {formatUSD(value0)}
              </Typography>
            </div>
            <div className="flex justify-between px-2 py-1">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={token1} width={20} height={20} />
                <Typography variant="sm" weight={500} className="text-slate-300">
                  {underlying1?.toSignificant(6)} {token1.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
                {formatUSD(value1)}
              </Typography>
            </div>
          </>
        )}

        {isStakedLoading && !isStakedError && !stakedBalance ? (
          <div className="flex flex-col gap-3 px-2 py-4">
            <div className="flex justify-between mb-1 py-0.5">
              <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
              <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
            </div>
            <div className="flex justify-between py-0.5">
              <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
              <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
            </div>
            <div className="flex justify-between py-0.5">
              <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
              <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-2 py-4 mt-2">
            <div className="flex items-center justify-between mb-1">
              <Typography variant="sm" weight={600} className="text-slate-100">
                Staked Position
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-100">
                {formatUSD(stakedValue0 + stakedValue1)}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={token0} width={20} height={20} />
                <Typography variant="sm" weight={500} className="text-slate-300">
                  {stakedUnderlying0?.toSignificant(6)} {token0.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
                {formatUSD(stakedValue0)}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={token1} width={20} height={20} />
                <Typography variant="sm" weight={500} className="text-slate-300">
                  {stakedUnderlying1?.toSignificant(6)} {token1.symbol}
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
                {formatUSD(stakedValue1)}
              </Typography>
            </div>
          </div>
        )}

        <div className="px-2 mt-3">
          <PoolButtons pool={pool} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
