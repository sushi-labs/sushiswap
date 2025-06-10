import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/ui/pathname-button'
import { type ChainId, ChainKey, type EvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'

export function NavigationItems({ chainId }: { chainId: ChainId }) {
  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${ChainKey[chainId]}/explore/tokens`}
      >
        <PathnameButton
          id="tokens"
          pathname={`/${ChainKey[chainId]}/explore/tokens`}
          asChild
          size="sm"
        >
          Tokens
        </PathnameButton>
      </LinkInternal>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${ChainKey[chainId]}/explore/pools`}
      >
        <PathnameButton
          id="pools"
          pathname={`/${ChainKey[chainId]}/explore/pools`}
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
          href={`/${ChainKey[chainId]}/explore/blade-pools`}
        >
          <PathnameButton
            id="blade-pools"
            pathname={`/${ChainKey[chainId]}/explore/blade-pools`}
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
