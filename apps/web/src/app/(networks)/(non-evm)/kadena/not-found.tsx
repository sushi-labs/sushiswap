import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button, LinkInternal, typographyVariants } from '@sushiswap/ui'

export default function NotFound() {
  return (
    <div className="flex justify-center items-center pt-20 px-4">
      <div className="flex flex-col gap-8 text-center">
        <h2
          className={typographyVariants({
            variant: 'h1',
            className: 'max-w-lg font-semibold',
          })}
        >
          Not Found
        </h2>
        <div className="flex justify-center gap-8">
          <Button
            variant="link"
            size="xl"
            asChild
            icon={ChevronRightIcon}
            iconPosition="end"
          >
            <LinkInternal href="/kadena/swap">Swap Tokens</LinkInternal>
          </Button>
          <Button
            variant="link"
            size="xl"
            asChild
            icon={ChevronRightIcon}
            iconPosition="end"
          >
            <LinkInternal href={`/kadena/explore/pools`}>
              Explore Pools
            </LinkInternal>
          </Button>
        </div>
      </div>
    </div>
  )
}
