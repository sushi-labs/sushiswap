import type React from 'react'
import { formatNumber, withoutScientificNotation } from 'sushi'

interface FormattedNumberProps {
  number: number | string | undefined
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({ number }) => {
  if (typeof number === 'undefined') return undefined
  if (typeof number === 'number') {
    if (!Number.isFinite(number)) return '∞'
    number = number.toString()
  }
  if (number === '∞') return number

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
    return <span>{formatNumber(numberStr)}</span>
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

export { FormattedNumber }
