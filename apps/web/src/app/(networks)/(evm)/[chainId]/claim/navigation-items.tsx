import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'

export function NavigationItems({ chainId }: { chainId: EvmChainId }) {
  const chainKey = getEvmChainById(chainId).key

  return (
    <>
      <LinkInternal shallow={true} scroll={false} href={`/${chainKey}/claim`}>
        <PathnameButton
          id="fees"
          pathname={`/${chainKey}/claim`}
          asChild
          size="sm"
        >
          <span className="flex items-center gap-2">
            <span>💰</span>{' '}
            <span>
              Fees <sup>v3</sup>
            </span>
          </span>
        </PathnameButton>
      </LinkInternal>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/${chainKey}/claim/rewards`}
      >
        <PathnameButton
          id="rewards"
          pathname={`/${chainKey}/claim/rewards`}
          asChild
          size="sm"
        >
          <span className="flex items-center gap-2">
            <span>🍣</span>{' '}
            <span>
              Rewards <sup>v3</sup>
            </span>
          </span>
        </PathnameButton>
      </LinkInternal>
    </>
  )
}
