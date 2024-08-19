import React from 'react'

import { MigrateTabContent } from 'src/ui/pool/MigrateTabContent'
import { ChainId } from 'sushi'

export default function MigratePage({
  params,
}: { params: { chainId: string } }) {
  return <MigrateTabContent chainId={+params.chainId as ChainId} />
}
