import {
  MarketId,
  getChainIdAuctioneerMarketFromMarketId,
} from '@sushiswap/bonds-sdk'
import { getBond } from '@sushiswap/client'
import { Container, Separator } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { unsanitize } from 'sushi'
import {
  BondsMarketDetails,
  BondsPositionsTable,
  BondsWidget,
} from '../../../ui/bonds'

export default async function BondPage({
  params: { id },
}: { params: { id: MarketId } }) {
  const marketId = unsanitize(id) as MarketId

  // Will throw an error if the market id is invalid
  getChainIdAuctioneerMarketFromMarketId(marketId)

  const bond = await unstable_cache(
    async () => getBond({ marketId }),
    ['bond', marketId],
    {
      revalidate: 5,
    },
  )()

  if (!bond) {
    notFound()
  }

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BondsWidget bond={bond} />
          </div>
          <div className="flex flex-col gap-6">
            <BondsMarketDetails bond={bond} />
          </div>
        </div>
        <div className="py-4">
          <Separator />
        </div>
        <BondsPositionsTable payoutTokenId={bond.payoutToken.id} />
      </div>
    </Container>
  )
}
