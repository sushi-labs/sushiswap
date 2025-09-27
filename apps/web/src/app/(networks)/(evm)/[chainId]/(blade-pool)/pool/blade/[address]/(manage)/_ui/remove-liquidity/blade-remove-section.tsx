'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useState } from 'react'
import { APPROVE_TAG_REMOVE_LEGACY } from 'src/lib/constants'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  CheckerProvider,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { useBladePoolPosition } from '../blade-pool-position-provider'
import { BladeRemoveLiquidityReviewModal } from './blade-remove-liquidity-review-modal'
import { BladeRemoveSectionWidget } from './blade-remove-section-widget'

interface BladeRemoveSectionProps {
  pool: BladePool
}

export const BladeRemoveSection: FC<BladeRemoveSectionProps> = withCheckerRoot(
  ({ pool }) => {
    const [percentage, setPercentage] = useState<string>('0')

    const { balance, liquidityToken } = useBladePoolPosition()
    const poolTotalSupply = useTotalSupply(liquidityToken)

    const userPositionValue = useMemo(() => {
      if (
        !balance?.amount ||
        !poolTotalSupply?.amount ||
        poolTotalSupply.amount === 0n
      ) {
        return 0
      }

      const poolProportion =
        Number(balance.amount) / Number(poolTotalSupply.amount)
      return pool.liquidityUSD * poolProportion
    }, [balance, poolTotalSupply, pool.liquidityUSD])

    const onSuccess = useCallback(() => {
      setPercentage('0')
    }, [])

    const hasValidAmount = +percentage > 0

    return (
      <CheckerProvider>
        <BladeRemoveSectionWidget
          chainId={pool.chainId}
          percentage={percentage}
          totalUsdValue={userPositionValue}
          setPercentage={setPercentage}
        >
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={pool.chainId}>
              <Checker.Success tag={APPROVE_TAG_REMOVE_LEGACY}>
                <BladeRemoveLiquidityReviewModal
                  pool={pool}
                  percentage={percentage}
                  onSuccess={onSuccess}
                >
                  <Button
                    size="xl"
                    fullWidth
                    disabled={!hasValidAmount}
                    testId="remove-liquidity"
                  >
                    {hasValidAmount ? 'Withdraw' : 'Enter Amount'}
                  </Button>
                </BladeRemoveLiquidityReviewModal>
              </Checker.Success>
            </Checker.Network>
          </Checker.Connect>
        </BladeRemoveSectionWidget>
      </CheckerProvider>
    )
  },
)
