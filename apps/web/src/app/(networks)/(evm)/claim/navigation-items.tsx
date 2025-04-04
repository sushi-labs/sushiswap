import { LinkInternal } from '@sushiswap/ui'
import { PathnameButton } from 'src/ui/pathname-button'

export function NavigationItems() {
  return (
    <>
      <LinkInternal shallow={true} scroll={false} href={`/claim`}>
        <PathnameButton id="fees" pathname={`/claim`} asChild size="sm">
          <span className="flex items-center gap-2">
            <span>💰</span>{' '}
            <span>
              Fees <sup>v3</sup>
            </span>
          </span>
        </PathnameButton>
      </LinkInternal>
      <LinkInternal shallow={true} scroll={false} href={`/claim/rewards`}>
        <PathnameButton
          id="rewards"
          pathname={`/claim/rewards`}
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
