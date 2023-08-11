'use client'

import { useDerivedStateSimpleSwap } from './derivedstate-simpleswap-provider'

export const SimpleSwapHeader = () => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  return <span>chainId: {chainId}</span>
}
