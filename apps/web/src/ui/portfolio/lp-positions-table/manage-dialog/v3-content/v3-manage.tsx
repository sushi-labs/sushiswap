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
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { ConcentratedLiquidityRemoveWidget } from 'src/ui/pool/ConcentratedLiquidityRemoveWidget'
import { ConcentratedLiquidityWidget } from 'src/ui/pool/ConcentratedLiquidityWidget'
import { SushiSwapV3FeeAmount } from 'sushi/config'
import { Native, SUSHI, WETH9 } from 'sushi/currency'
import { RemoveLiquidity } from './remove-liquidity'

type LPManageTabValueType = 'add' | 'remove'
const LPManageTabValues: LPManageTabValueType[] = ['add', 'remove']

const TABS = [
  { label: 'Add Liquidity', value: 'add' },
  { label: 'Remove Liquidity', value: 'remove' },
]

export const V3Manage = ({ position }: { position: any }) => {
  const { createQuery } = useCreateQuery()
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

  const { data: _position } = useConcentratedPositionInfo({
    chainId: 1,
    token0: SUSHI[1],
    tokenId: '1942',
    token1: Native.onChain(1),
  })

  const { data: positionDetails, isLoading: _isPositionDetailsLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: 1,
      tokenId: '1942',
    })

  const content = useMemo(() => {
    switch (currentTab) {
      case 'add':
        return (
          <ConcentratedLiquidityWidget
            withTitleAndDescription={false}
            chainId={1}
            account={'0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0'}
            token0={SUSHI[1]}
            token1={Native.onChain(1)}
            feeAmount={SushiSwapV3FeeAmount.MEDIUM}
            // tokensLoading={token0Loading || token1Loading}
            tokensLoading={false}
            // existingPosition={position ?? undefined}
            existingPosition={_position ?? undefined}
            tokenId={'1942'}
          />
        )
      case 'remove':
        return (
          <RemoveLiquidity
            token0={SUSHI[1]}
            token1={Native.onChain(1)}
            chainId={1}
            account={'0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0'}
            position={_position ?? undefined}
            positionDetails={positionDetails}
          />
        )
    }
  }, [currentTab, positionDetails, _position])

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
              defaultValue: getDefaultTTL(position.chainId).toString(),
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
