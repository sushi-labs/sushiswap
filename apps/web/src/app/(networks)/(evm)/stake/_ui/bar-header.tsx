import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, LinkExternal } from '@sushiswap/ui'

export const BarHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex flex-col md:gap-2">
        <h1 className="text-2xl md:text-4xl font-semibold">Sushi Bar</h1>

        <p className="md:text-xl !max-w-[790px] text-muted-foreground">
          For every swap on Sushi, a portion of the swap fee is locked into the
          liquidity pool awaiting to be served to xSUSHI holders.
        </p>
      </div>
      <div>
        <LinkExternal href="https://www.sushi.com/blog/sushi-bar-faq">
          <Button
            variant="secondary"
            asChild
            icon={ArrowTopRightOnSquareIcon}
            iconPosition="end"
            iconProps={{
              className: '!w-3.5 !h-3.5',
            }}
            className="!text-primary"
          >
            Learn More
          </Button>
        </LinkExternal>
      </div>
    </div>
  )
}
