import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useState } from 'react'
import {
  PortfolioHeader,
  PortfolioPositions,
  PortfolioTokens,
} from '../../user-portfolio'

enum PortfolioTab {
  Tokens = 'Tokens',
  Positions = 'Positions',
  // Claimable = 'Claimable',
  // History = 'History',
}

export const SidebarPortfolioView = () => {
  const [tab, setTab] = useState(PortfolioTab.Tokens)

  return (
    <div className="flex flex-col bg-background pb-4">
      <div className="shrink-0">
        <PortfolioHeader />
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as PortfolioTab)}
      >
        <div className="px-7">
          <TabsList variant="underline">
            {Object.values(PortfolioTab).map((_tab) => (
              <TabsTrigger key={_tab} value={_tab} variant="underline">
                {_tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={PortfolioTab.Tokens}>
          <PortfolioTokens />
        </TabsContent>
        <TabsContent value={PortfolioTab.Positions}>
          <PortfolioPositions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
