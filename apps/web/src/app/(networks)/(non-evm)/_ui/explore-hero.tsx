import {
  Button,
  LinkExternal,
  LinkInternal,
  typographyVariants,
} from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import type { FC } from 'react'
import { type ChainId, getChainById } from 'sushi'

export const ExploreHero: FC<{ chainId: ChainId }> = ({ chainId }) => {
  return (
    <section className="flex flex-col justify-between gap-8 lg:gap-12 lg:flex-row">
      <div className="flex flex-col flex-grow gap-3 lg:gap-6 items-start">
        <div className="flex flex-col">
          <h1 className={'text-4xl md:text-5xl font-bold tracking-tighter'}>
            Put your funds to work <br />
            by providing liquidity.
          </h1>
          <p
            className={typographyVariants({
              variant: 'lead',
              className: 'max-w-[500px]',
            })}
          >
            When you add liquidity to a pool, you can receive a share of its
            trading volume and potentially snag extra rewards when there are
            incentives involved!
          </p>
        </div>
        <div className="flex items-center w-full">
          <Button asChild size="lg">
            <LinkInternal href={`/${getChainById(chainId).key}/pool/add`}>
              I want to create a position
            </LinkInternal>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:gap-4 items-start lg:items-end">
        <div className="flex flex-col items-start gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">
            Looking for a partnership with Sushi?
          </span>
          <Button
            className="flex-1 w-fit sm:flex-0"
            variant="link"
            size="sm"
            asChild
          >
            <LinkInternal href="/partner">Apply here</LinkInternal>
          </Button>
        </div>
        <div className="flex flex-col items-start gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">Need Help?</span>
          <Button icon={DiscordIcon} variant="link" size="sm" asChild>
            <LinkExternal href="https://sushi.com/discord">
              Join our discord
            </LinkExternal>
          </Button>
        </div>
      </div>
    </section>
  )
}
