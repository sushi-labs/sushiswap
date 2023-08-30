import { FuroChainId } from '@sushiswap/furo-sdk'
import { FC } from 'react'

import { CliffDetailsSection } from './CliffDetailsSection'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { GradedVestingDetailsSection } from './GradedVestingDetailsSection'

export const VestingForm: FC<{ chainId: FuroChainId; index: number }> = ({ chainId, index }) => {
  return (
    <>
      <GeneralDetailsSection chainId={chainId} index={index} />
      <CliffDetailsSection index={index} />
      <GradedVestingDetailsSection index={index} />
    </>
  )
}
