'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useState } from 'react'
import { APPROVE_TAG_REMOVE_BLADE } from 'src/lib/constants'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  CheckerProvider,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { useBladePoolOnchainData } from '~evm/[chainId]/(blade-pool)/pool/blade/[address]/_ui/blade-pool-onchain-data-provider'
import { useBladePoolPosition } from '../blade-pool-position-provider'
import { BladeRemoveLiquidityReviewModal } from './blade-remove-liquidity-review-modal'
import { BladeRemoveSectionWidget } from './blade-remove-section-widget'

interface BladeRemoveSectionProps {
  pool: BladePool
}

export const BladeRemoveSection: FC<BladeRemoveSectionProps> = withCheckerRoot(
  ({ pool }) => {
    const [percentage, setPercentage] = useState<string>('0')

    const { balance } = useBladePoolPosition()
    const { liquidityUSD, liquidity: poolTotalSupply } =
      useBladePoolOnchainData()

    const userPositionValue = useMemo(() => {
      if (!balance?.amount || poolTotalSupply === 0n) {
        return 0
      }

      const poolProportion = Number(balance.amount) / Number(poolTotalSupply)
      return liquidityUSD * poolProportion
    }, [balance, poolTotalSupply, liquidityUSD])

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
              <Checker.Success tag={APPROVE_TAG_REMOVE_BLADE}>
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
