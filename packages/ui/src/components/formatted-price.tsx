import React from 'react'
import { withoutScientificNotation } from 'sushi'

interface FormattedPriceProps {
  number: string | undefined
}

const FormattedPrice: React.FC<FormattedPriceProps> = ({ number }) => {
  if (typeof number === 'undefined') return undefined

  const numberStr = withoutScientificNotation(number)

  if (typeof numberStr === 'undefined') return undefined

  const parts = numberStr.split('.')
  const integerPart = parts[0]
  const fractionalPart = parts[1]

  const zeroGroups =
    fractionalPart &&
    fractionalPart.charAt(0) === '0' &&
    fractionalPart.match(/(?:0+)/) // Match consecutive zeros

  if (
    integerPart !== '0' ||
    !zeroGroups ||
    zeroGroups[0].length <= 4 ||
    zeroGroups[0].length === fractionalPart.length
  ) {
    // If no zero groups found or less than or equal to 4 zeros, return regular rendering
    return <span>{numberStr}</span>
  }

  const zeroCount = zeroGroups[0].length

  return (
    <span>
      {integerPart}.0
      <sub>{zeroCount}</sub>
      {fractionalPart.slice(zeroCount)}
    </span>
  )
}

export { FormattedPrice }
