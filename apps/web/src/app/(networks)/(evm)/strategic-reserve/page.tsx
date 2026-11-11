import { Card, CardContent, Container } from '@sushiswap/ui'
import { ReserveChart } from './_ui/reserve-chart'
import { SushiAcquiredData } from './_ui/sushi-acquired-data'
import { TransactionsTable } from './_ui/transactions-table'

export default async function Page() {
  return (
    <Container
      maxWidth="7xl"
      className="flex flex-col gap-6 px-2 pb-8 sm:px-4 md:gap-8 md:pb-16"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-x-0 md:divide-x md:divide-accent">
            <div className="col-span-1 h-full">
              <div className="divide-y divide-accent grid gap-6 md:gap-0 [&>*:last-child]:pt-6 w-full h-full">
                <SushiAcquiredData />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 md:pl-6">
              <ReserveChart />
            </div>
          </div>
        </CardContent>
      </Card>
      <TransactionsTable />
    </Container>
  )
}
