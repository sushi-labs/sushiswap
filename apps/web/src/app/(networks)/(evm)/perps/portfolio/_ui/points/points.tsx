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
        <Card className="p-2 lg:p-4 !rounded-md flex !bg-[#18223B] border-transparent flex-col lg:flex-row gap-6 justify-between w-full">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="text-muted-foreground font-medium lg:text-lg">
              Points (Season 1)
            </div>
            <div className="flex gap-2 lg:gap-8 flex-col lg:flex-row">
              <_Item label="Total Points Earned" value="Coming Soon" />
              <_Item label="Points Earner (7D)" value="Coming Soon" />
              <_Item label="Points Earner (30D)" value="Coming Soon" />
            </div>
          </div>
          <Button disabled variant="perps-default" className="lg:!my-auto">
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

const _Item = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <div className="text-muted-foreground text-xs lg:text-sm">{label}</div>
      <div className="font-medium text-lg md:text-2xl">{value}</div>
    </div>
  )
}
