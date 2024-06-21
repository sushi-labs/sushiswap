import { getPools } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import React from 'react'

import { NewPoolsTable } from 'src/ui/pool/NewPoolsTable'

export default async function PoolPage({
  params,
}: {
  params: { chainId: string }
}) {
  const pools = await unstable_cache(
    async () => getPools({ chainId: params.chainId }),
    ['pools', params.chainId],
    {
      revalidate: 60 * 3,
    },
  )()

  return (
    <Container maxWidth="7xl" className="px-4">
      <NewPoolsTable pools={pools} />
    </Container>
  )
}
