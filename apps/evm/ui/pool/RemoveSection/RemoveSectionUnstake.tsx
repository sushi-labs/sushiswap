import { ChainId } from '@sushiswap/chain'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { tryParseAmount } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { useMasterChefWithdraw } from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useGraphPool } from 'lib/hooks'
import { FC, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

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

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = withCheckerRoot(({ pool, chefType, farmId }) => {
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
      chainId={pool.chainId as ChainId}
      value={value}
      setValue={setValue}
      reserve0={reserve0}
      reserve1={reserve1}
      liquidityToken={liquidityToken}
    >
      <Checker.Connect fullWidth>
        <Checker.Network fullWidth chainId={pool.chainId}>
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
        </Checker.Network>
      </Checker.Connect>
    </RemoveSectionUnstakeWidget>
  )
})
