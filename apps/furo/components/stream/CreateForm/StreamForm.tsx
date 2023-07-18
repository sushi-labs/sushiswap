import { FuroStreamRouterChainId } from '@sushiswap/furo/exports/exports'
import { FC } from 'react'

import { GeneralDetailsSection } from './GeneralDetailsSection'
import { StreamAmountDetails } from './StreamAmountDetails'

export const StreamForm: FC<{ chainId: FuroStreamRouterChainId; index: number }> = ({ chainId, index }) => {
  return (
    <>
      <GeneralDetailsSection index={index} />
      <StreamAmountDetails chainId={chainId} index={index} />
    </>
  )
}
