import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Type } from '@sushiswap/currency'
import { getBentoboxTotals } from './getBentoboxTotals'

export const getBentoboxTotal = async ({ chainId, currency }: { chainId: BentoBoxV1ChainId; currency: Type }) => {
  if (!chainId) return undefined

  const totals = await getBentoboxTotals(chainId, [currency])

  if (!totals || !currency) {
    return undefined
  }

  return totals[0]
}
