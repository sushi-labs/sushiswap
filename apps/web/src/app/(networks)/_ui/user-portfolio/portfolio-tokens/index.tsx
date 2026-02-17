import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useState } from 'react'
import { PortfolioEvmSvmTokens } from './portfolio-evm-svm-tokens'
import { PortfolioStellarTokens } from './portfolio-stellar-tokens'

const TABS = ['EVM/Solana', 'Stellar'] as const

export const PortfolioTokens = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>('EVM/Solana')

  return (
    <div className="flex flex-col h-full gap-y-5">
      <Tabs
        value={tab}
        onValueChange={(val) => setTab(val as (typeof TABS)[number])}
        className="w-full space-y-4 h-full"
      >
        <div className="flex px-5 gap-x-2">
          <TabsList className="w-full h-8">
            {TABS.map((_tab) => (
              <TabsTrigger
                key={_tab}
                value={_tab}
                className="w-full h-7 text-xs"
              >
                {_tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="EVM/Solana" className="h-full">
          <PortfolioEvmSvmTokens />
        </TabsContent>
        <TabsContent value="Stellar" className="h-full">
          <PortfolioStellarTokens />
        </TabsContent>
      </Tabs>
    </div>
  )
}
