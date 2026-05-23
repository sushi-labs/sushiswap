import { Button, classNames } from '@sushiswap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useVaultBalances, useVaultPositions } from 'src/lib/perps'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import type { EvmAddress } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { AggregateTradeHistory, VaultFilter } from './filters'
import {
  VAULT_TABLES_TABS,
  type VaultTablesTabValue,
  useVaultTables,
} from './vault-tables-provider'

export const VaultTables = ({
  vaultAddress,
  className,
}: { vaultAddress: EvmAddress; className?: string }) => {
  const {
    state: { activeTab },
    mutate: { setActiveTab },
  } = useVaultTables()

  const MobileChildren = useMemo(
    () =>
      VAULT_TABLES_TABS.find((tab) => tab.value === activeTab)?.mobileChildren,
    [activeTab],
  )

  const ActiveContent = useMemo(() => {
    return VAULT_TABLES_TABS.find((t) => t.value === activeTab)?.content
  }, [activeTab])
  const { data: balances } = useVaultBalances(vaultAddress)
  const { data: vaultPositions } = useVaultPositions(vaultAddress)
  const { data: vaultData } = useVaultDetails({ vaultAddress })

  const balanceCount = balances?.length || 0
  const positionCount = vaultPositions?.length || 0

  const depositorsCount = vaultData?.followers?.length || 0

  const tabNameRewrite = useMemo(() => {
    return VAULT_TABLES_TABS.map((tab) => {
      if (tab.value === 'balances') {
        return {
          value: tab.value,
          name: `Balances${balanceCount ? ` (${balanceCount})` : ''}`,
        }
      }
      if (tab.value === 'positions') {
        return {
          value: tab.value,
          name: `Positions${positionCount ? ` (${positionCount})` : ''}`,
        }
      }
      if (tab.value === 'depositors') {
        return {
          value: tab.value,
          name: `Depositors${depositorsCount ? ` (${depositorsCount >= 100 ? '100+' : depositorsCount})` : ''}`,
        }
      }
      return tab
    })
  }, [balanceCount, positionCount, depositorsCount])

  return (
    <PerpsCard className={classNames('py-2', className ?? '')}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as VaultTablesTabValue)}
      >
        <div className="flex flex-wrap justify-between p-1 gap-2 pt-0">
          <PerpsCard rounded="full">
            <TabsList
              className={classNames(
                '!px-0.5 !h-8 !bg-perps-muted/[.02] !max-w-[calc(100vw-36px)] hide-scrollbar overflow-x-auto overflow-y-hidden !rounded-full !border-transparent !justify-start',
              )}
              style={{
                // @dev: tailwind max-w not working on safari mobile
                maxWidth: 'calc(100vw - 20px)',
              }}
            >
              {tabNameRewrite?.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!px-1.5 !text-xs"
                  asChild
                >
                  <Button
                    size="xs"
                    variant={
                      activeTab === tab.value ? 'perps-secondary' : 'ghost'
                    }
                    className="!p-0 w-full col-span-1 capitalize !text-xs !rounded-full !border-0"
                  >
                    {tab.name}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>
          </PerpsCard>

          <div className="items-center gap-2 whitespace-nowrap flex lg:max-w-fit justify-between w-full px-1">
            {activeTab === 'deposits-withdrawals' ||
            activeTab === 'depositors' ? null : (
              <VaultFilter />
            )}
            <div className="flex items-center justify-end gap-4 text-sm lg:text-base">
              {MobileChildren ? (
                <div className="flex lg:hidden">
                  <MobileChildren />
                </div>
              ) : null}
              {activeTab === 'trade-history' ? <AggregateTradeHistory /> : null}
            </div>
          </div>
        </div>
        {VAULT_TABLES_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="!mt-0">
            <div
              className={classNames(
                'py-2 !pt-0 min-h-[275px] max-h-[380px] hide-scrollbar overflow-y-auto',
              )}
            >
              <div>{ActiveContent ? <ActiveContent /> : null}</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PerpsCard>
  )
}
