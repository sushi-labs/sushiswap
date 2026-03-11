import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { Explainer, FormSection, SkeletonText } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { formatPercent } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { getTokenRatios } from '../utils'
import {
  SteerPositionAdd,
  SteerPositionAddProvider,
} from './steer-liquidity-management'

interface SmartPoolLiquidityWidgetProps {
  vault: VaultV1
}

export const SmartPoolLiquidityWidget: FC<SmartPoolLiquidityWidgetProps> = ({
  vault,
}) => {
  const { data: prices } = usePrices({ chainId: vault.chainId })

  const tokenRatios = useMemo(() => {
    if (!prices) return undefined

    return getTokenRatios({ vault, prices })
  }, [prices, vault])

  return (
    <FormSection
      title="Liquidity"
      description={
        <>
          Depending on your range, the supplied tokens for this position will
          not always be at 50:50 ratio.
          <br />
          <br />
          <span>
            <span className="mr-1">{`Token Ratio (${vault.token0.symbol} : ${vault.token1.symbol})`}</span>
            <Explainer iconProps={{ className: 'inline mb-0.5' }}>
              This is the ratio of the cash values of the two underlying tokens
              in this position.
            </Explainer>
          </span>
          <br />
          {tokenRatios ? (
            `= ${formatPercent(tokenRatios.token0)} : ${formatPercent(
              tokenRatios.token1,
            )}`
          ) : (
            <SkeletonText />
          )}
        </>
      }
    >
      <SteerPositionAddProvider>
        <SteerPositionAdd vault={vault} />
      </SteerPositionAddProvider>
    </FormSection>
  )
}
