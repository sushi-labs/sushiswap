'use client'

import { APPROVE_TAG_UNSTAKE } from 'src/lib/constants'
import { EvmChainId, SUSHI, XSUSHI } from 'sushi/evm'
import { BarSection } from './BarSection'

export const UnstakeSection = () => {
  return (
    <BarSection
      inputToken={XSUSHI[EvmChainId.ETHEREUM]}
      outputToken={SUSHI[EvmChainId.ETHEREUM]}
      approveTag={APPROVE_TAG_UNSTAKE}
    />
  )
}
