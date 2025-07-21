'use client'

import { APPROVE_TAG_STAKE } from 'src/lib/constants'
import { ChainId } from 'sushi/chain'
import { SUSHI, XSUSHI } from 'sushi/currency'
import { BarSection } from './BarSection'

export const StakeSection = () => {
  return (
    <BarSection
      inputToken={SUSHI[ChainId.ETHEREUM]}
      outputToken={XSUSHI[ChainId.ETHEREUM]}
      approveTag={APPROVE_TAG_STAKE}
    />
  )
}
