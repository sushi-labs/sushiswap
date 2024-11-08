import { VaultV1 } from '@sushiswap/graph-client/data-api'
import { getTokenRatios } from '@sushiswap/steer-sdk'
import { Explainer, FormSection, SkeletonText } from '@sushiswap/ui'
import { FC, useMemo, useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { formatPercent } from 'sushi/format'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import {
  SteerPositionAdd,
  SteerPositionAddProvider,
  SteerPositionZap,
} from './Steer/SteerLiquidityManagement'
import { ToggleZapCard } from './ToggleZapCard'

interface SmartPoolLiquidityWidgetProps {
  vault: VaultV1
}

export const SmartPoolLiquidityWidget: FC<SmartPoolLiquidityWidgetProps> = ({
  vault,
}) => {
  const [useZap, setUseZap] = useState(isZapSupportedChainId(vault.chainId))

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
      {isZapSupportedChainId(vault.chainId) ? (
        <ToggleZapCard checked={useZap} onCheckedChange={setUseZap} />
      ) : null}
      {useZap ? (
        <SteerPositionZap vault={vault} />
      ) : (
        <SteerPositionAddProvider>
          <SteerPositionAdd vault={vault} />
        </SteerPositionAddProvider>
      )}
    </FormSection>
  )
}
