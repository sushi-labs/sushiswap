'use client'

import { ChainId } from '@sushiswap/chain'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { List, Widget, WidgetDescription, WidgetFooter, WidgetHeader, WidgetTitle } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency as UICurrency } from '@sushiswap/ui/components/currency'
import { Dots } from '@sushiswap/ui/components/dots'
import { useMasterChefWithdraw } from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { FC, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import { unwrapToken } from '../../lib/functions'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface AddSectionStakeProps {
  chainId: ChainId
  pool: Pool
  chefType: ChefType
  farmId: number
}

export const RemoveSectionUnstake: FC<{ poolId: string }> = ({ poolId }) => {
  const isMounted = useIsMounted()
  const { data: pool } = usePool({ args: poolId, swrConfig: useSWRConfig() })

  if (!pool) return <></>

  if (!pool?.incentives || pool.incentives.length === 0 || !isMounted) return <></>

  return (
    <_RemoveSectionUnstake
      chainId={pool.chainId as ChainId}
      pool={pool}
      chefType={pool.incentives[0].chefType}
      farmId={Number(pool.incentives[0].pid)}
    />
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = withCheckerRoot(
  ({ chainId, pool, chefType, farmId }) => {
    const [value, setValue] = useState('')
    const { balance } = usePoolPositionStaked()

    console.log(balance?.toExact())
    const amount = useMemo(() => {
      return balance?.multiply(value).divide(100)
    }, [balance, value])

    const { sendTransaction, isLoading: isWritePending } = useMasterChefWithdraw({
      chainId,
      amount,
      pid: farmId,
      chef: chefType,
    })

    return (
      <Widget id="stakeLiquidity" variant="empty">
        <WidgetHeader>
          <WidgetTitle>Unstake Liquidity</WidgetTitle>
          <WidgetDescription>
            Unstake your liquidity tokens first if you mean to remove your liquidity position
          </WidgetDescription>
        </WidgetHeader>
        <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary">
          <div className="flex justify-between gap-4">
            <div>
              <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">{value}%</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                fullWidth
                size="sm"
                variant={value === '25' ? 'default' : 'secondary'}
                onClick={() => setValue('25')}
                testId="unstake-25"
              >
                25%
              </Button>
              <Button
                fullWidth
                size="sm"
                variant={value === '50' ? 'default' : 'secondary'}
                onClick={() => setValue('50')}
                testId="unstake-50"
              >
                50%
              </Button>
              <Button
                fullWidth
                size="sm"
                variant={value === '75' ? 'default' : 'secondary'}
                onClick={() => setValue('75')}
                testId="unstake-75"
              >
                75%
              </Button>
              <Button
                fullWidth
                size="sm"
                variant={value === '100' ? 'default' : 'secondary'}
                onClick={() => setValue('100')}
                testId="unstake-max"
              >
                MAX
              </Button>
            </div>
          </div>
          <div className="px-1 pt-2 pb-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="range"
              min="1"
              max="100"
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
            />
          </div>
        </div>
        <List className="!pt-4">
          <List.Control className="!bg-secondary">
            {amount ? (
              <List.KeyValue flex title={`SLP Received`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <UICurrency.Icon currency={amount.currency} width={18} height={18} />
                    {amount.toSignificant(4)} {unwrapToken(amount.currency).symbol}
                  </div>
                </div>
              </List.KeyValue>
            ) : null}
          </List.Control>
        </List>
        <WidgetFooter>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={pool.chainId}>
              <Checker.Guard guardWhen={Boolean(balance && balance.equalTo(ZERO))} guardText="No staked tokens">
                <Checker.Guard
                  guardWhen={Boolean(amount && balance && amount.greaterThan(balance))}
                  guardText="Insufficient balance"
                >
                  <Button
                    onClick={() => sendTransaction?.()}
                    fullWidth
                    size="xl"
                    disabled={isWritePending || !sendTransaction}
                    testId="unstake-liquidity"
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake Liquidity'}
                  </Button>
                </Checker.Guard>
              </Checker.Guard>
            </Checker.Network>
          </Checker.Connect>
        </WidgetFooter>
      </Widget>
    )
  }
)
