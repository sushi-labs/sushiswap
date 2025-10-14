import { PactNumber } from '@kadena/pactjs'
import { withoutScientificNotation } from 'sushi'

export const formatPactDecimal = (value: number): string => {
  if (!Number.isFinite(value)) return '0.0'

  // Get the string representation
  const str = withoutScientificNotation(value.toString())
  if (!str) return '0.0'
  return new PactNumber(value).toDecimal()
}
