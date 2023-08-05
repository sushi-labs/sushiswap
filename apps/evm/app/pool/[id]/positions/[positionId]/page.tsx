import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { IconButton } from '@sushiswap/ui'
import Link from 'next/link'

import { PositionView } from '../../../../../ui/pool/PositionView'

export default async function PositionsPage({ params }: { params: { id: string; positionId: string } }) {
  const [chainId] = params.id.split('%3A') as [ChainId, string]

  return (
    <div className="relative mt-6">
      <div className="xl:absolute xl:ml-[-56px] mb-4 flex items-center gap-4">
        <Link href={`/pool/${params.id}/positions`} className="flex items-center gap-1 text-muted-foreground">
          <IconButton variant="ghost" name="go back" icon={ChevronLeftIcon} description="Go back to positions" />
          <span className="text-sm block xl:hidden font-medium">View all positions</span>
        </Link>
      </div>
      <PositionView params={{ id: `${chainId}%3A${params.positionId}` }} />
    </div>
  )
}
