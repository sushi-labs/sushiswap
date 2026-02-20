import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import {
  type EvmChainId,
  getEvmChainById,
  isBladeChainId,
  isSushiSwapChainId,
} from 'sushi/evm'

export function NavigationItems({ chainId }: { chainId: EvmChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const isBladeChain = isBladeChainId(chainId)
  const isSmartPoolChain = isSmartPoolChainId(chainId)

  return (
    <>
      <NavigationItem
        pathname={`/${chainKey}/explore/tokens`}
        id="tokens"
        disabled={!isSushiSwapChainId(chainId)}
      >
        Tokens
      </NavigationItem>
      <NavigationItem
        pathname={`/${chainKey}/explore/pools`}
        id="pools"
        disabled={!isSushiSwapChainId(chainId)}
      >
        Pools
      </NavigationItem>
      <NavigationItem
        pathname={`/${chainKey}/explore/blade-pools`}
        id="blade-pools"
        disabled={!isBladeChain}
      >
        Blade Pools
      </NavigationItem>
      <NavigationItem
        pathname={`/${chainKey}/explore/smart-pools`}
        id="smart-pools"
        disabled={!isSmartPoolChain}
      >
        Smart Pools
      </NavigationItem>
    </>
  )
}

interface NavigationItemProps {
  pathname: string
  id: string
  disabled?: boolean
  children: React.ReactNode
}

function NavigationItem({
  pathname,
  id,
  disabled = false,
  children,
}: NavigationItemProps) {
  if (disabled) {
    return (
      <PathnameButton pathname="" size="sm" disabled>
        {children}
      </PathnameButton>
    )
  }

  return (
    <LinkInternal shallow={true} scroll={false} href={pathname}>
      <PathnameButton id={id} pathname={pathname} asChild size="sm">
        {children}
      </PathnameButton>
    </LinkInternal>
  )
}
