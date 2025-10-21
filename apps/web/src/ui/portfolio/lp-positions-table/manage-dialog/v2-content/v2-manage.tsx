import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { type RawV2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  SettingsModule,
  SettingsOverlay,
  SkeletonBox,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { useTokensFromPosition } from 'src/lib/wagmi/hooks/portfolio/use-tokens-from-position'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import type { EvmAddress, EvmChainId, SushiSwapV2ChainId } from 'sushi/evm'
import { AddLiquidityV2 } from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-v2'
import { PoolPositionProvider } from '~evm/[chainId]/pool/v2/[address]/_common/ui/pool-position-provider'
import { RemoveLiquidity } from './remove-liquidity'

type LPManageTabValueType = 'add' | 'remove'
const LPManageTabValues: LPManageTabValueType[] = ['add', 'remove']

const TABS = [
  { label: 'Add Liquidity', value: 'add' },
  { label: 'Remove Liquidity', value: 'remove' },
]

export const V2Manage = ({
  position,
}: { position: PortfolioV2PositionPoolType }) => {
  const { createQuery } = useCreateQuery()
  const [currentTab, setCurrentTab] = useState<LPManageTabValueType>('add')
  const searchParams = useSearchParams()
  const manageTabParam = searchParams.get('lpManageTab') as
    | LPManageTabValueType
    | undefined

  const { data: pool, isLoading } = useQuery<RawV2Pool | null>({
    queryKey: ['v2-pool-portfolio'],
    queryFn: async () => {
      const result = await getV2Pool({
        chainId: position.pool.chainId as SushiSwapV2ChainId,
        address: position.pool.address as EvmAddress,
      })
      return result
    },
  })
  const { token0, token1 } = useTokensFromPosition({ data: position })

  useEffect(() => {
    if (manageTabParam && LPManageTabValues.includes(manageTabParam)) {
      setCurrentTab(manageTabParam)
    }
  }, [manageTabParam])

  const content = useMemo(() => {
    switch (currentTab) {
      case 'add':
        return (
          <AddLiquidityV2
            initToken0={token0}
            initToken1={token1}
            chainId={position.pool.chainId as EvmChainId}
            hideTokenSelectors={true}
            hideEstimatedValue={true}
          />
        )
      case 'remove':
        if (!pool || isLoading) {
          return (
            <div className="flex flex-col gap-3">
              <SkeletonBox className="h-32" />
              <SkeletonBox className="h-32" />
              <SkeletonBox className="h-14" />
            </div>
          )
        }

        return (
          <PoolPositionProvider pool={pool}>
            <RemoveLiquidity pool={pool} />
          </PoolPositionProvider>
        )
    }
  }, [currentTab, position, pool, isLoading, token0, token1])

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
              defaultValue: getDefaultTTL(
                position.pool.chainId as EvmChainId,
              ).toString(),
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

      <TabsContent value={currentTab}>{content}</TabsContent>
    </Tabs>
  )
}
