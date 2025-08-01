import { APPROVE_TAG_UNSTAKE } from 'src/lib/constants'
import { ChainId } from 'sushi/chain'
import { SUSHI, XSUSHI } from 'sushi/currency'
import { BarSection } from './BarSection'

export const UnstakeSection = () => {
  return (
    <BarSection
      inputToken={XSUSHI[ChainId.ETHEREUM]}
      outputToken={SUSHI[ChainId.ETHEREUM]}
      approveTag={APPROVE_TAG_UNSTAKE}
    />
  )
}
