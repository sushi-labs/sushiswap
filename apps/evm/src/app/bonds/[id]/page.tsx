import { Container, Separator } from '@sushiswap/ui'
import {
  BondsMarketDetails,
  BondsPositionsTable,
  BondsWidget,
} from '../../../ui/bonds'

export default async function BondPage() {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BondsWidget />
          </div>
          <div className="flex flex-col gap-6">
            <BondsMarketDetails />
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <BondsPositionsTable />
      </div>
    </Container>
  )
}
