import { FC } from 'react'
import { FuroStreamRouterChainId } from '@sushiswap/furo/exports/exports'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { CliffDetailsSection } from './CliffDetailsSection'
import { GradedVestingDetailsSection } from './GradedVestingDetailsSection'

export const VestingForm: FC<{ chainId: FuroStreamRouterChainId; index: number }> = ({ chainId, index }) => {
  return (
    <>
      <GeneralDetailsSection chainId={chainId} index={index} />
      <CliffDetailsSection index={index} />
      <GradedVestingDetailsSection index={index} />
    </>
  )
}
