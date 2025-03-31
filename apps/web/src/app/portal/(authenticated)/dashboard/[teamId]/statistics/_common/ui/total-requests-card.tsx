import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Explainer,
} from '@sushiswap/ui'

export function TotalRequestsCard() {
  return (
    <Card className="!gap-2 w-full">
      <CardHeader>
        <CardDescription className="flex flex-row space-x-1 items-center">
          <span>Total Requests</span>
          <Explainer>In the last 24 hours.</Explainer>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-medium">2.1M</CardContent>
    </Card>
  )
}
