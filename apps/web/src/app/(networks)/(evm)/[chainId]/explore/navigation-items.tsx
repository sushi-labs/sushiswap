import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { type EvmChainId, getEvmChainById, isBladeChainId } from 'sushi/evm'

export function NavigationItems({ chainId }: { chainId: EvmChainId }) {
  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${getEvmChainById(chainId).key}/explore/tokens`}
      >
        <PathnameButton
          id="tokens"
          pathname={`/${getEvmChainById(chainId).key}/explore/tokens`}
          asChild
          size="sm"
        >
          Tokens
        </PathnameButton>
      </LinkInternal>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${getEvmChainById(chainId).key}/explore/pools`}
      >
        <PathnameButton
          id="pools"
          pathname={`/${getEvmChainById(chainId).key}/explore/pools`}
          asChild
          size="sm"
        >
          Pools
        </PathnameButton>
      </LinkInternal>
      {isBladeChainId(chainId as EvmChainId) ? (
        <LinkInternal
          shallow={true}
          scroll={false}
          href={`/${getEvmChainById(chainId).key}/explore/blade-pools`}
        >
          <PathnameButton
            id="blade-pools"
            pathname={`/${getEvmChainById(chainId).key}/explore/blade-pools`}
            asChild
            size="sm"
          >
            Blade Pools
          </PathnameButton>
        </LinkInternal>
      ) : (
        <PathnameButton pathname="" size="sm" disabled>
          Blade Pools
        </PathnameButton>
      )}
    </>
  )
}
