'use client'

import { Container } from '@sushiswap/ui'
import { Manage } from '~kadena/_common/ui/Pools/Manage/Manage'
import { PoolPosition } from '~kadena/_common/ui/Pools/PoolPosition/PoolPosition'

export default function AddRemoveLiqPage() {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Manage />
        </div>
        <div className="flex flex-col gap-6">
          <PoolPosition />
        </div>
      </div>
    </Container>
  )
}
