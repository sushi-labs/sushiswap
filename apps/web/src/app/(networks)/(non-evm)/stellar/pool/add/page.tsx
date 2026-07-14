'use client'

import { type ReactElement, useState } from 'react'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  type StellarToken,
} from 'sushi/stellar'
import { SelectStellarPoolFeeWidget } from './_ui/select-stellar-pool-fee-widget'
import { SelectStellarPoolTokensWidget } from './_ui/select-stellar-pool-tokens-widget'
import { StellarAddPoolPositionWidget } from './_ui/stellar-add-pool-position-widget'

export default function AddPoolPage(): ReactElement {
  const [token0, setToken0] = useState<StellarToken | undefined>(
    STELLAR_XLM[StellarChainId.STELLAR],
  )
  const [token1, setToken1] = useState<StellarToken | undefined>(
    STELLAR_USDC[StellarChainId.STELLAR],
  )
  const [selectedFee, setSelectedFee] = useState<number>(3000)

  return (
    <>
      <SelectStellarPoolTokensWidget
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
      />
      <SelectStellarPoolFeeWidget
        token0={token0}
        token1={token1}
        selectedFee={selectedFee}
        setSelectedFee={setSelectedFee}
      />
      <StellarAddPoolPositionWidget
        key={`${token0?.address ?? ''}:${token1?.address ?? ''}:${selectedFee}`}
        token0={token0}
        token1={token1}
        selectedFee={selectedFee}
      />
    </>
  )
}
