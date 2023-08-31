import { FuroChainId } from '@sushiswap/furo-sdk'
import { FC } from 'react'

import { GeneralDetailsSection } from './GeneralDetailsSection'
import { StreamAmountDetails } from './StreamAmountDetails'

export const StreamForm: FC<{ chainId: FuroChainId; index: number }> = ({ chainId, index }) => {
  return (
    <>
      <GeneralDetailsSection index={index} />
      <StreamAmountDetails chainId={chainId} index={index} />
    </>
  )
}
