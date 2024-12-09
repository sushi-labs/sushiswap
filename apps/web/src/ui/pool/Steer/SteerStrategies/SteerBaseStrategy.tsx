'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Explainer,
  IconButton,
  LinkExternal,
  Separator,
  SettingsModule,
  SettingsOverlay,
  Stat,
  StatLabel,
  StatValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  WidgetAction,
} from '@sushiswap/ui'
import { formatPercent, formatUSD } from 'sushi/format'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { FormattedNumber } from '@sushiswap/ui'
import { useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { SteerStrategyComponent } from '.'
import { APRHoverCard } from '../../APRHoverCard'
import { ToggleZapCard } from '../../ToggleZapCard'
import { SteerAPRChart } from '../SteerAPRChart'
import { SteerLiquidityInRangeChip } from '../SteerLiquidityDistributionWidget/SteerLiquidityInRangeChip'
import {
  SteerPositionAdd,
  SteerPositionAddProvider,
  SteerPositionDetails,
  SteerPositionRemove,
  SteerPositionZap,
} from '../SteerLiquidityManagement'
import { SteerStrategyLiquidityDistribution } from '../SteerStrategyLiquidityChart'

export const SteerBaseStrategy: SteerStrategyComponent = ({
  pool,
  vault,
  generic: { priceExtremes, tokenRatios, adjustment, positions },
}) => {
  const [isZapModeEnabled, setIsZapModeEnabled] = useState(
    isZapSupportedChainId(vault.chainId),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
            <CardDescription>
              Depending on your range, the supplied tokens for this position
              will not always be a 50:50 ratio.
            </CardDescription>
          </CardHeader>
          <Tabs className="w-full" defaultValue="add">
            <CardContent>
              <TabsList className="!flex">
                <TabsTrigger
                  testdata-id="add-tab"
                  value="add"
                  className="flex flex-1"
                >
                  Add
                </TabsTrigger>
                <TabsTrigger
                  testdata-id="remove-tab"
                  value="remove"
                  className="flex flex-1"
                >
                  Remove
                </TabsTrigger>
                <TabsTrigger
                  testdata-id="position-tab"
                  value="position"
                  className="flex flex-1"
                >
                  Position
                </TabsTrigger>
              </TabsList>
            </CardContent>
            <div className="px-6">
              <Separator />
            </div>
            <TabsContent value="add">
              <CardHeader className="relative">
                <CardTitle>Add liquidity</CardTitle>
                <CardDescription>
                  Provide liquidity to earn fees & rewards.
                </CardDescription>
                <WidgetAction>
                  <SettingsOverlay
                    options={{
                      slippageTolerance: {
                        storageKey:
                          SlippageToleranceStorageKey.AddSteerLiquidity,
                        title: 'Add Liquidity Slippage',
                      },
                    }}
                    modules={[SettingsModule.SlippageTolerance]}
                  >
                    <IconButton
                      size="sm"
                      name="Settings"
                      icon={Cog6ToothIcon}
                      variant="secondary"
                    />
                  </SettingsOverlay>
                </WidgetAction>
              </CardHeader>
              <CardContent>
                {isZapSupportedChainId(vault.chainId) ? (
                  <ToggleZapCard
                    checked={isZapModeEnabled}
                    onCheckedChange={setIsZapModeEnabled}
                  />
                ) : null}
                {isZapModeEnabled ? (
                  <SteerPositionZap vault={vault} tokenRatios={tokenRatios} />
                ) : (
                  <SteerPositionAddProvider>
                    <SteerPositionAdd vault={vault} />
                  </SteerPositionAddProvider>
                )}
              </CardContent>
            </TabsContent>
            <TabsContent value="remove">
              <CardHeader>
                <CardTitle>Remove liquidity</CardTitle>
                <CardDescription>
                  Please enter how much of the position you want to remove.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SteerPositionRemove vault={vault} />
              </CardContent>
            </TabsContent>
            <TabsContent value="position">
              <SteerPositionDetails vault={vault} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{vault.strategy}</CardTitle>
            <CardDescription>{vault.description}</CardDescription>
          </CardHeader>
          <Separator />
          <div className="h-[200px] rounded-xl flex flex-col p-6">
            <Stat className="mb-2">
              <StatLabel size="sm">7 day average fee APR</StatLabel>
            </Stat>
            <SteerAPRChart vault={vault} />
          </div>
          <Separator />
          <div className="grid grid-cols-2">
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Total APR (24h)</StatLabel>
              <StatValue size="sm">
                <APRHoverCard pool={pool} smartPoolAPR={vault.apr1d}>
                  <span className="underline decoration-dotted underline-offset-2">
                    {formatPercent(vault.apr1d + pool.incentiveApr)}
                  </span>
                </APRHoverCard>
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">TVL</StatLabel>
              <StatValue size="sm">{formatUSD(vault.reserveUSD)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">
                {vault.token0.symbol}:{vault.token1.symbol} Ratio (%)
              </StatLabel>
              <StatValue size="sm">
                {formatPercent(tokenRatios.token0)} :{' '}
                {formatPercent(tokenRatios.token1)}
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm" className="flex gap-1">
                Adjustment frequency
                <Explainer>
                  The frequency at which this strategy gets adjusted. This does
                  not guarantee the strategy gets adjusted, its a minimum
                  threshold.
                </Explainer>
              </StatLabel>
              <StatValue size="sm">
                At most every {adjustment.frequency}
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">
                {adjustment.next.includes('ago') ? 'Last' : 'Next'} Adjustment
              </StatLabel>
              <StatValue size="sm">{adjustment.next}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Liquidity pool fee</StatLabel>
              <StatValue size="sm">{formatPercent(pool.swapFee)}</StatValue>
            </Stat>
            {/* <Stat className="px-6 py-3">
              <StatLabel size="sm">Time frame</StatLabel>
              <StatValue size="sm">20 days</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Deviation</StatLabel>
              <StatValue size="sm">2</StatValue>
            </Stat> */}
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Performance fee</StatLabel>
              <StatValue size="sm">
                {formatPercent(vault.performanceFee)}
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Provider</StatLabel>
              <StatValue size="sm">
                <LinkExternal href="https://steer.finance/">
                  SteerFinance
                </LinkExternal>
              </StatValue>
            </Stat>
          </div>
          <Separator />
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Liquidity Distribution</CardTitle>
              <SteerLiquidityInRangeChip vault={vault} />
            </div>
          </CardHeader>
          <div className="px-6 h-[200px] w-full">
            <SteerStrategyLiquidityDistribution
              pool={pool}
              positions={positions}
            />
          </div>
          <div className="flex flex-row flex-wrap whitespace-nowrap gap-2 justify-between p-6">
            <Stat>
              <StatLabel size="sm">Minimum price</StatLabel>
              <StatValue size="sm">
                <FormattedNumber number={priceExtremes.min} />{' '}
                {vault.token0.symbol}/{vault.token1.symbol}
              </StatValue>
            </Stat>
            <Stat>
              <StatLabel size="sm">Maximum price</StatLabel>
              <StatValue size="sm">
                <FormattedNumber number={priceExtremes.max} />{' '}
                {vault.token0.symbol}/{vault.token1.symbol}
              </StatValue>
            </Stat>
          </div>
        </Card>
      </div>
    </div>
  )
}
