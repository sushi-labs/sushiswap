import {
  Button,
  Card,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'

export const Points = () => {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <Card className="p-2 !rounded-md flex !bg-[#18223B] border-transparent flex-col gap-6 justify-between w-full md:!max-w-[300px]">
          <div className="text-muted-foreground font-medium lg:text-lg">
            Points (Season 1)
          </div>
          <div>
            <div className="text-muted-foreground text-xs lg:text-sm">
              Points Balance
            </div>
            <div className="font-medium text-lg md:text-2xl">Coming Soon</div>
          </div>
          <Button disabled variant="perps-default">
            Dashboard Coming Soon
          </Button>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          Points are being tracked from day one. Any points earned before the
          dashboard launches will appear once it goes live.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
