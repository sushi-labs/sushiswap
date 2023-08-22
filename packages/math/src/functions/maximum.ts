/**
 * Returns the biggest member of the array
 * @param values the values from which the biggest gets returned
 * @returns the biggest memmber of the array
 */
export function maximum(...values: bigint[]): bigint {
  let highest = values[0]
  for (let i = 1; i < values.length; i++) {
    const value = values[i]
    if (value > highest) {
      highest = value
    }
  }
  return highest
}
