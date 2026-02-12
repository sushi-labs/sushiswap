import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
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

  const content = useMemo(() => {
    switch (tab) {
      case PortfolioTab.Tokens:
        return <PortfolioTokens />
      case PortfolioTab.Positions:
        return <PortfolioPositions />
      // case PortfolioTab.Claimable:
      //   return <PortfolioClaimables />
      // case PortfolioTab.History:
      // return <PortfolioHistory />
    }
  }, [tab])

  return (
    <div className="flex flex-col h-full gap-y-3">
      <PortfolioHeader />
      <div className="flex px-5 gap-x-2">
        {Object.values(PortfolioTab).map((_tab) => (
          <Button
            key={_tab}
            asChild
            size="xs"
            variant={_tab === tab ? 'secondary' : 'ghost'}
            onClick={() => setTab(_tab)}
            className="select-none"
          >
            {_tab}
          </Button>
        ))}
      </div>
      {content}
    </div>
  )
}
