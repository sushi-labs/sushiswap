import { LinkInternal } from '@sushiswap/ui'
import { V3PositionView } from 'src/ui/pool/V3PositionView'
import { ChainId, ChainKey } from 'sushi/chain'

export default async function V3PositionsPage({
  params,
}: { params: { chainId: string; address: string; position: string } }) {
  const chainId = +params.chainId as ChainId

  return (
    <div className="flex flex-col gap-4">
      <LinkInternal
        href={`/${ChainKey[chainId]}/pool/v3/${params.address}`}
        className="text-blue hover:underline text-sm"
      >
        ← Pool
      </LinkInternal>
      <V3PositionView params={params} />
    </div>
  )
}
