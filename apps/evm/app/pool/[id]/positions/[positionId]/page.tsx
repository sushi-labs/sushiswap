import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { ChainId } from '@sushiswap/chain'
import { IconButton } from '@sushiswap/ui'
import Link from 'next/link'

import { PositionView } from '../../../../../ui/pool/PositionView'

export default async function PositionsPage({ params }: { params: { id: string; positionId: string } }) {
  const [chainId] = params.id.split('%3A') as [ChainId, string]

  return (
    <div className="relative">
      <div className="xl:absolute xl:ml-[-56px] mb-4 flex items-center gap-4">
        <Link href={`/pool/${params.id}/positions`} className="flex items-center gap-1">
          <IconButton name="go back" size="sm" icon={ArrowLeftIcon} />
          <span className="text-sm block xl:hidden font-medium">Go back to positions</span>
        </Link>
      </div>
      <PositionView params={{ id: `${chainId}%3A${params.positionId}` }} />
    </div>
  )
}
