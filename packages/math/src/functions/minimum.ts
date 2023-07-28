/**
 * Returns the smallest member of the array
 * @param values the values from which the smallest gets returned
 * @returns the smallest memmber of the array
 */
export function minimum(...values: bigint[]): bigint {
  let lowest = values[0]
  for (let i = 1; i < values.length; i++) {
    const value = values[i]
    if (value < lowest) {
      lowest = value
    }
  }
  return lowest
}
