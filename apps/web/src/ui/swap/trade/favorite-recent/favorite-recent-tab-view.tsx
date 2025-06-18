import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { Wrapper } from '../wrapper'
import { Favorite } from './favorite'
import { NetworkMenu } from './network-menu'
import { Recent } from './recent'

enum FavoriteRecentTab {
  Favorite = 'Favorite',
  Recent = 'Recent',
}

export const FavoriteRecentTabView = () => {
  const [tab, setTab] = useState<FavoriteRecentTab>(FavoriteRecentTab.Favorite)

  const handleTabChange = (tab: FavoriteRecentTab) => {
    setTab(tab)
  }

  const content = useMemo(() => {
    switch (tab) {
      case FavoriteRecentTab.Favorite:
        return <Favorite />
      case FavoriteRecentTab.Recent:
        return <Recent />
    }
  }, [tab])

  return (
    <Wrapper className="hidden md:block">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex gap-x-2">
          {Object.values(FavoriteRecentTab).map((_tab) => (
            <Button
              key={_tab}
              asChild
              size="sm"
              variant={_tab === tab ? 'tertiary' : 'ghost'}
              onClick={() => {
                handleTabChange(_tab)
              }}
              className="select-none !gap-1"
            >
              {_tab}
            </Button>
          ))}
        </div>
        <NetworkMenu className="!px-1" />
      </div>
      <div className="mt-4 max-h-[500px] overflow-y-auto hide-scrollbar">
        {content}
      </div>
    </Wrapper>
  )
}
