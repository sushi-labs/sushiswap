import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { MigrateTabContent } from 'src/ui/pool/MigrateTabContent'
import { ChainId } from 'sushi'
import { isSushiSwapV2ChainId } from 'sushi/config'

export const metadata: Metadata = {
  title: 'Migrate',
  description: 'A SushiSwap V2 to V3 migration tool.',
}

export default function MigratePage({
  params,
}: { params: { chainId: string } }) {
  const chainId = +params.chainId as ChainId

  if (!isSushiSwapV2ChainId(chainId)) {
    return notFound()
  }

  return <MigrateTabContent chainId={chainId} />
}
