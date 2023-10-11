import { Container, LinkInternal } from '@sushiswap/ui'
import { PositionView } from 'ui/pool/PositionView'

export default async function PositionsPage({
  params,
}: { params: { id: string; positionId: string } }) {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={`/pool/${params.id}`}
          className="text-blue hover:underline text-sm"
        >
          ← View all positions
        </LinkInternal>
        <PositionView params={{ id: `${params.id}%3A${params.positionId}` }} />
      </div>
    </Container>
  )
}
