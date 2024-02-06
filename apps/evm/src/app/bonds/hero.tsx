'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { LinkExternal, LinkInternal, typographyVariants } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { DiscordIcon } from '@sushiswap/ui/components/icons'
import { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start mb-12">
      <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
        <div className="flex flex-col">
          <h1 className={typographyVariants({ variant: 'h1' })}>Sushi Bonds</h1>
          <p
            className={typographyVariants({
              variant: 'lead',
              className: 'max-w-[500px]',
            })}
          >
            Acquire tokens at a discount from the current market price. Tokens
            will be released according to their vesting schedule per bond
            market.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-[unset] gap-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            iconPosition="end"
            icon={ArrowTopRightOnSquareIcon}
          >
            <LinkExternal
              href="https://www.sushi.com/blog/faq-sushi-bonds"
              className="!text-current"
            >
              Learn More
            </LinkExternal>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 lg:items-end">
        <div className="flex flex-col items-center gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">
            Looking for a partnership with Sushi?
          </span>
          <Button
            className="flex-1 w-full sm:flex-0 sm:w-[unset]"
            variant="link"
            size="sm"
            asChild
          >
            <LinkInternal href="/partner">Apply here</LinkInternal>
          </Button>
        </div>
        <div className="flex flex-col items-center gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">Need Help?</span>
          <Button icon={DiscordIcon} variant="link" size="sm" asChild>
            <LinkExternal href="https://discord.gg/NVPXN4e">
              Join our discord
            </LinkExternal>
          </Button>
        </div>
      </div>
    </section>
  )
}
