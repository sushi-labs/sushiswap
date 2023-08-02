import { Container } from '@sushiswap/ui'
import React from 'react'

import { MigrateTab } from '../../../../ui/pool/PoolsSection/MigrateTab'

export default function MigratePage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <MigrateTab />
    </Container>
  )
}
