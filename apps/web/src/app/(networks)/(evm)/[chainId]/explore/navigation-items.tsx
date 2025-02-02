import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/ui/pathname-button'
import { ChainId, ChainKey } from 'sushi/chain'

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
          id="all-pools"
          pathname={`/${ChainKey[chainId]}/explore/pools`}
          asChild
          size="sm"
        >
          All Pools
        </PathnameButton>
      </LinkInternal>
      {isSmartPoolChainId(chainId) ? (
        <LinkInternal
          shallow={true}
          scroll={false}
          href={`/${ChainKey[chainId]}/explore/smart-pools`}
        >
          <PathnameButton
            id="smart-pools"
            pathname={`/${ChainKey[chainId]}/explore/smart-pools`}
            asChild
            size="sm"
          >
            Smart Pools
          </PathnameButton>
        </LinkInternal>
      ) : (
        <PathnameButton pathname="" size="sm" disabled>
          Smart Pools
        </PathnameButton>
      )}
    </>
  )
}
