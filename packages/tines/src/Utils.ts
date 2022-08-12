import { BigNumber } from '@ethersproject/bignumber'

export function ASSERT(f: () => boolean, t?: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (!f() && t) console.error(t)
  }
}

let DEBUG_MODE = false
export function DEBUG(f: () => unknown) {
  if (DEBUG_MODE) f()
}
export function DEBUG_MODE_ON(on: boolean) {
  DEBUG_MODE = on
}

export function closeValues(a: number, b: number, accuracy: number, logInfoIfFalse = ''): boolean {
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  const res = Math.abs(a / b - 1) < accuracy
  if (!res) {
    console.log('Expected close: ', a, b, accuracy, logInfoIfFalse)
    // debugger
  }
  return res
}

export function calcSquareEquation(a: number, b: number, c: number): [number, number] {
  const D = b * b - 4 * a * c
  console.assert(D >= 0, `Discriminant is negative! ${a} ${b} ${c}`)
  const sqrtD = Math.sqrt(D)
  return [(-b - sqrtD) / 2 / a, (-b + sqrtD) / 2 / a]
}

// returns such x > 0 that f(x) = out or 0 if there is no such x or f defined not everywhere
// hint - approximation of x to spead up the algorithm
// f assumed to be continues monotone growth function defined everywhere
export function revertPositive(f: (x: number) => number, out: number, hint = 1) {
  try {
    if (out <= f(0)) return 0
    let min, max
    if (f(hint) > out) {
      min = hint / 2
      while (f(min) > out) min /= 2
      max = min * 2
    } else {
      max = hint * 2
      while (f(max) < out) max *= 2
      min = max / 2
    }

    while (max / min - 1 > 1e-4) {
      const x0: number = (min + max) / 2
      const y0 = f(x0)
      if (out === y0) return x0
      if (out < y0) max = x0
      else min = x0
    }
    return (min + max) / 2
  } catch (e) {
    return 0
  }
}

export function getBigNumber(value: number): BigNumber {
  const v = Math.abs(value)
  if (v < Number.MAX_SAFE_INTEGER) return BigNumber.from(Math.round(value))

  const exp = Math.floor(Math.log(v) / Math.LN2)
  console.assert(exp >= 51, 'Internal Error 314')
  const shift = exp - 51
  const mant = Math.round(v / Math.pow(2, shift))
  const res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift))
  return value > 0 ? res : res.mul(-1)
}
