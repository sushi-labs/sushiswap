import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { type EvmChainId, isSushiSwapV2ChainId } from 'sushi/evm'
import { MigrateTabContent } from './_ui/migrate-tab-content'

export const metadata: Metadata = {
  title: 'Migrate',
  description: 'A SushiSwap V2 to V3 migration tool.',
}

export default async function MigratePage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as EvmChainId

  if (!isSushiSwapV2ChainId(chainId)) {
    return notFound()
  }

  return <MigrateTabContent chainId={chainId} />
}
