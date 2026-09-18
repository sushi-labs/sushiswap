import { Container } from '@sushiswap/ui'
import { DataRow } from './_ui/data-row'
import { ReserveChart } from './_ui/reserve-chart'
import { TransactionsTable } from './_ui/transactions-table'

export default async function Page() {
  return (
    <Container
      maxWidth="8xl"
      className="flex flex-col gap-6 px-2 pb-8 sm:px-4 md:gap-8 md:pb-16"
    >
      <DataRow />
      <ReserveChart />
      <TransactionsTable />
    </Container>
  )
}
