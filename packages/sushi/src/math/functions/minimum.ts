function minimum(...values: number[]): number
function minimum(...values: bigint[]): bigint

/**
 * Returns the smallest member of the array
 * @param values the values from which the smallest gets returned
 * @returns the smallest memmber of the array
 */
function minimum(...values: number[] | bigint[]) {
  let lowest = values[0] as number | bigint
  for (let i = 1; i < values.length; i++) {
    const value = values[i] as number | bigint
    if (value < lowest) {
      lowest = value
    }
  }
  return lowest
}

export { minimum }
