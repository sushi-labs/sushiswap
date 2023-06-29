import { GeneralDetailsSection } from './GeneralDetailsSection'
import { StreamAmountDetails } from './StreamAmountDetails'
import { FC } from 'react'
import { FuroStreamRouterChainId } from '@sushiswap/furo/exports/exports'

export const StreamForm: FC<{ chainId: FuroStreamRouterChainId; index: number }> = ({ chainId, index }) => {
  return (
    <>
      <GeneralDetailsSection index={index} />
      <StreamAmountDetails chainId={chainId} index={index} />
    </>
  )
}
