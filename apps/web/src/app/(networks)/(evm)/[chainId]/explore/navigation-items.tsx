import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { isPublicBladeChainId } from 'src/config.server'
import { showBladeFlag } from 'src/flags'
import {
  type EvmChainId,
  getEvmChainById,
  isBladeChainId,
  isSushiSwapChainId,
} from 'sushi/evm'

export async function NavigationItems({ chainId }: { chainId: EvmChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const isBladeChain =
    isBladeChainId(chainId) && (await isPublicBladeChainId(chainId))
  const showBlade = await showBladeFlag()

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
      {showBlade ? (
        <NavigationItem
          pathname={`/${chainKey}/explore/blade-pools`}
          id="blade-pools"
          disabled={!isBladeChain}
        >
          Blade Pools
        </NavigationItem>
      ) : null}
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
