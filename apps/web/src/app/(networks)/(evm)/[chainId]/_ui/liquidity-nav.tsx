'use client'

import {
  LinkInternal,
  Tabs,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
} from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import type { ChainId } from 'sushi'
import { getChainById } from 'sushi'

const getLinkOptions = (chainId: ChainId) => [
  {
    href: `/${getChainById(chainId).key}/explore/pools`,
    label: 'Explore',
    value: 'explore' as const,
  },
  {
    href: `/${getChainById(chainId).key}/pool`,
    label: 'My Positions',
    value: 'my-positions' as const,
  },
]

function getActiveTab(pathname: string): 'explore' | 'my-positions' | '' {
  const [, , section, page] = pathname.split('/')

  if (section === 'explore' && page === 'pools') return 'explore'
  return 'my-positions'
}

export const LiquidityNavDesktop = ({ chainId }: { chainId: ChainId }) => {
  const linkOptions = useMemo(() => getLinkOptions(chainId), [chainId])
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)

  return (
    <ToggleGroup className="h-fit w-fit">
      {linkOptions.map((i, idx) => (
        <LinkInternal href={i.href} key={idx}>
          <Toggle className="w-[250px]" pressed={activeTab === i.value}>
            {i.label}
          </Toggle>
        </LinkInternal>
      ))}
    </ToggleGroup>
  )
}

export const LiquidityNavMobile = ({ chainId }: { chainId: ChainId }) => {
  const linkOptions = useMemo(() => getLinkOptions(chainId), [chainId])
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)

  return (
    <Tabs className="w-full" value={activeTab}>
      <TabsList variant="underline">
        {linkOptions.map((i, idx) => (
          <LinkInternal href={i.href} key={idx}>
            <TabsTrigger variant="underline" value={i.value}>
              {i.label}
            </TabsTrigger>
          </LinkInternal>
        ))}
      </TabsList>
    </Tabs>
  )
}
