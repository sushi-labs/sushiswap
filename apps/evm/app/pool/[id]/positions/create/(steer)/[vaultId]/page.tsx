'use client'

import { unsanitize } from '@sushiswap/format'

export default function SteerVaultPage({ params }: { params: { vaultId: string } }) {
  const vaultId = unsanitize(params.vaultId)

  return <></>
}
