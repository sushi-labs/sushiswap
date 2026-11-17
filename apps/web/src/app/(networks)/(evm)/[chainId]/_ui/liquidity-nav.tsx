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

export const LiquidityNavDesktop = ({ chainId }: { chainId: ChainId }) => {
  const linkOptions = useMemo(() => getLinkOptions(chainId), [chainId])
  const pathname = usePathname()
  const isExplorePage = pathname.includes('/explore')

  return (
    <ToggleGroup className="h-fit w-fit">
      {linkOptions.map((i, idx) => (
        <LinkInternal href={i.href} key={idx}>
          <Toggle
            className="!px-16"
            onClick={() => {}}
            pressed={isExplorePage && i.href.includes('/explore')}
          >
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
  const isExplorePage = pathname.includes('/explore')

  return (
    <Tabs className="w-full">
      <TabsList variant="underline">
        {linkOptions.map((i, idx) => (
          <LinkInternal href={i.href} key={idx}>
            <TabsTrigger
              variant="underline"
              data-state={
                isExplorePage && i.href.includes('/explore')
                  ? 'active'
                  : 'inactive'
              }
              value={i.value}
            >
              {i.label}
            </TabsTrigger>
          </LinkInternal>
        ))}
      </TabsList>
    </Tabs>
  )
}
