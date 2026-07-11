'use client'

import type { Dispatch, ReactElement, SetStateAction } from 'react'
import { StellarChainId, type StellarToken } from 'sushi/stellar'
import { SelectTokensWidget } from '~evm/[chainId]/pool/_ui/select-tokens-widget'

interface SelectStellarPoolTokensWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  setToken0: Dispatch<SetStateAction<StellarToken | undefined>>
  setToken1: Dispatch<SetStateAction<StellarToken | undefined>>
}

export function SelectStellarPoolTokensWidget({
  token0,
  token1,
  setToken0,
  setToken1,
}: SelectStellarPoolTokensWidgetProps): ReactElement {
  function handleToken0Select(token: StellarToken): void {
    setToken0(token)
  }

  function handleToken1Select(token: StellarToken): void {
    setToken1(token)
  }

  return (
    <SelectTokensWidget
      chainId={StellarChainId.STELLAR}
      token0={token0}
      token1={token1}
      setToken0={handleToken0Select}
      setToken1={handleToken1Select}
    />
  )
}
