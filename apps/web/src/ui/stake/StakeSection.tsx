'use client'

import { APPROVE_TAG_STAKE } from 'src/lib/constants'
import { EvmChainId, SUSHI, XSUSHI } from 'sushi/evm'
import { BarSection } from './BarSection'

export const StakeSection = () => {
  return (
    <BarSection
      inputToken={SUSHI[EvmChainId.ETHEREUM]}
      outputToken={XSUSHI[EvmChainId.ETHEREUM]}
      approveTag={APPROVE_TAG_STAKE}
    />
  )
}
