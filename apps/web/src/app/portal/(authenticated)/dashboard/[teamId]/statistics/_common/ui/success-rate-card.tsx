import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Explainer,
} from '@sushiswap/ui'

export function SuccessRateCard() {
  return (
    <Card className="!gap-2 w-full">
      <CardHeader>
        <CardDescription className="flex flex-row space-x-1 items-center">
          <span>Success Rate</span>
          <Explainer>In the last 24 hours.</Explainer>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-medium">15.3%</CardContent>
    </Card>
  )
}
