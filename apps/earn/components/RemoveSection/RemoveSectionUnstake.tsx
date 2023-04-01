import { tryParseAmount } from '@sushiswap/currency'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import { AppearOnMount, Button, Dots } from '@sushiswap/ui'
import { Approve, Checker, getMasterChefContractConfig, useMasterChefWithdraw } from '@sushiswap/wagmi'
import { FC, useMemo, useState } from 'react'

import { useGraphPool } from '../../lib/hooks'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'
import { useSWRConfig } from 'swr'

interface AddSectionStakeProps {
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
    <AppearOnMount show={true}>
      <_RemoveSectionUnstake
        pool={pool}
        chefType={pool.incentives[0].chefType}
        farmId={Number(pool.incentives[0].pid)}
      />
    </AppearOnMount>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pool, chefType, farmId }) => {
  const [value, setValue] = useState('')
  const {
    data: { reserve0, reserve1, liquidityToken },
  } = useGraphPool(pool)
  const { balance } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const { sendTransaction, isLoading: isWritePending } = useMasterChefWithdraw({
    chainId: liquidityToken.chainId,
    amount,
    pid: farmId,
    chef: chefType,
  })

  return (
    <RemoveSectionUnstakeWidget
      chainId={pool.chainId}
      value={value}
      setValue={setValue}
      reserve0={reserve0}
      reserve1={reserve1}
      liquidityToken={liquidityToken}
    >
      <Checker.Connected size="md">
        <Checker.Network size="md" chainId={pool.chainId}>
          <Checker.Custom
            showGuardIfTrue={Boolean(amount && balance && amount.greaterThan(balance))}
            guard={<Button size="md">Insufficient Balance</Button>}
          >
            <Approve
              className="flex-grow !justify-end"
              components={
                <Approve.Components>
                  <Approve.Token
                    size="md"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={amount}
                    address={getMasterChefContractConfig(pool.chainId, chefType)?.address}
                    enabled={Boolean(getMasterChefContractConfig(pool.chainId, chefType)?.address)}
                  />
                </Approve.Components>
              }
              render={({ approved }) => {
                return (
                  <Button
                    onClick={() => sendTransaction?.()}
                    fullWidth
                    size="md"
                    variant="filled"
                    disabled={!approved || isWritePending}
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake Liquidity'}
                  </Button>
                )
              }}
            />
          </Checker.Custom>
        </Checker.Network>
      </Checker.Connected>
    </RemoveSectionUnstakeWidget>
  )
}
