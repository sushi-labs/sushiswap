import { Button, classNames } from '@sushiswap/ui'
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
    <div className="flex flex-col bg-background pb-4">
      <div className="shrink-0">
        <PortfolioHeader />
      </div>
      <div className="flex shrink-0 px-7 gap-x-8">
        {Object.values(PortfolioTab).map((_tab) => (
          <Button
            key={_tab}
            asChild
            size="xs"
            variant="blank"
            onClick={() => setTab(_tab)}
            className={classNames(
              'select-none !h-11 !rounded-none !px-0 !text-base !font-medium border-b-2',
              _tab === tab
                ? 'border-pink text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary',
            )}
          >
            {_tab}
          </Button>
        ))}
      </div>
      {content}
    </div>
  )
}
