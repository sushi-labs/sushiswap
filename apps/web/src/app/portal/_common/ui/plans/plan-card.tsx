import type { StyroResults } from '@sushiswap/styro-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CloudinaryImage,
  FormattedNumber,
  List,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'

interface PlanCard {
  plan: StyroResults['getPlans']['data']['plans'][number]
  className?: string
  children?: React.ReactNode
}

export function PlanCard({ plan, children, className }: PlanCard) {
  return (
    <Card className={className}>
      <CardHeader className="flex !flex-row space-y-0 justify-between w-full">
        <div className="space-y-1.5">
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <span className={typographyVariants({ variant: 'h2' })}>
            {plan.priceUSD.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
            /m
          </span>
          <List>
            <List.Control>
              <List.KeyValue
                title="Request per second"
                className="whitespace-nowrap"
              >
                <FormattedNumber number={String(plan.swapRequests.perSecond)} />
              </List.KeyValue>
              <List.KeyValue
                title="Request per month"
                className="whitespace-nowrap"
              >
                <FormattedNumber number={String(plan.swapRequests.perMonth)} />
              </List.KeyValue>
            </List.Control>
          </List>
        </div>
      </CardContent>
      {children && <CardFooter>{children}</CardFooter>}
    </Card>
  )
}
