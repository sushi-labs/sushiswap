import JSBI from 'jsbi'

export function difference(a: JSBI, b: JSBI): JSBI {
  if (JSBI.greaterThan(a, b)) {
    return JSBI.subtract(a, b)
  }
  return JSBI.subtract(b, a)
}
