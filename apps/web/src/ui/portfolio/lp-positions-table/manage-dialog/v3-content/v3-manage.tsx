import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import type { PortfolioV2PositionV3PoolType } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  SettingsModule,
  SettingsOverlay,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { useTokensFromPosition } from 'src/lib/wagmi/hooks/portfolio/use-tokens-from-position'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { ConcentratedLiquidityWidget } from 'src/ui/pool/ConcentratedLiquidityWidget'
import type { SushiSwapV3ChainId } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { RemoveLiquidity } from './remove-liquidity'

type LPManageTabValueType = 'add' | 'remove'
const LPManageTabValues: LPManageTabValueType[] = ['add', 'remove']

const TABS = [
  { label: 'Add Liquidity', value: 'add' },
  { label: 'Remove Liquidity', value: 'remove' },
]

export const V3Manage = ({
  position,
}: { position: PortfolioV2PositionV3PoolType }) => {
  const { createQuery } = useCreateQuery()
  const { address } = useAccount()
  const [currentTab, setCurrentTab] = useState<LPManageTabValueType>('add')
  const searchParams = useSearchParams()
  const manageTabParam = searchParams.get('lpManageTab') as
    | LPManageTabValueType
    | undefined

  useEffect(() => {
    if (manageTabParam && LPManageTabValues.includes(manageTabParam)) {
      setCurrentTab(manageTabParam)
    }
  }, [manageTabParam])

  const chainId = position.pool.chainId as SushiSwapV3ChainId
  const tokenId = position.position?.tokenId

  const { token0, token1 } = useTokensFromPosition({ data: position })

  const { data: v3Position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const { data: positionDetails } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId,
      tokenId,
    })

  const content = useMemo(() => {
    switch (currentTab) {
      case 'add':
        return (
          <ConcentratedLiquidityWidget
            withTitleAndDescription={false}
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            feeAmount={positionDetails?.fee}
            tokensLoading={false}
            existingPosition={v3Position ?? undefined}
            tokenId={tokenId}
          />
        )
      case 'remove':
        return (
          <RemoveLiquidity
            token0={token0}
            token1={token1}
            chainId={chainId}
            account={address}
            position={v3Position ?? undefined}
            positionDetails={positionDetails}
          />
        )
    }
  }, [
    currentTab,
    positionDetails,
    v3Position,
    token0,
    token1,
    chainId,
    address,
    tokenId,
  ])

  return (
    <Tabs
      defaultValue={'add'}
      value={currentTab}
      onValueChange={(value) => {
        setCurrentTab(value as LPManageTabValueType)
        createQuery([
          {
            name: 'lpManageTab',
            value: value,
          },
        ])
      }}
    >
      <div className="flex items-center justify-between gap-3 mt-6">
        <TabsList className="!bg-transparent !rounded-[14px] shadow-sm !px-[1px] gap-1 w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!bg-transparent !border-none w-full  !shadow-none !px-0  focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
            >
              <Button
                key={tab.value}
                asChild
                size="sm"
                variant={currentTab === tab.value ? 'tertiary' : 'ghost'}
                className={'select-none !gap-1 w-full'}
              >
                {tab.label}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>

        <SettingsOverlay
          options={{
            slippageTolerance: {
              storageKey:
                currentTab === 'add'
                  ? SlippageToleranceStorageKey.AddLiquidity
                  : SlippageToleranceStorageKey.RemoveLiquidity,
              title:
                currentTab === 'add'
                  ? 'Add Liquidity Slippage'
                  : 'Remove Liquidity Slippage',
            },
            transactionDeadline: {
              storageKey:
                currentTab === 'add'
                  ? TTLStorageKey.AddLiquidity
                  : TTLStorageKey.RemoveLiquidity,
              defaultValue: getDefaultTTL(chainId).toString(),
            },
          }}
          modules={[
            SettingsModule.CustomTokens,
            SettingsModule.SlippageTolerance,
            SettingsModule.TransactionDeadline,
          ]}
        >
          <IconButton
            size="sm"
            name="Settings"
            icon={Cog6ToothIcon}
            variant="networks"
          />
        </SettingsOverlay>
      </div>
      <ConcentratedLiquidityProvider>
        <TabsContent value={currentTab} className="pt-2">
          {content}
        </TabsContent>
      </ConcentratedLiquidityProvider>
    </Tabs>
  )
}
