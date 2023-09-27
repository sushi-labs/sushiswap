import { expect } from 'chai'

function closeValues(_a: number | bigint, _b: number | bigint, accuracy: number): boolean {
  const a: number = typeof _a === 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b === 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

export function expectCloseValues(_a: number | bigint, _b: number | bigint, accuracy: number, logInfoIfFalse = '') {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).true
  }
  return res
}

export function tryCall<A>(f: () => A): A | undefined {
  try {
    return f()
  } catch (e) {
    //
  }
}

export async function tryCallAsync<A>(f: () => Promise<A>): Promise<A | undefined> {
  try {
    return await f()
  } catch (e) {
    //
  }
}

export function getRndLin(rnd: () => number, min: number, max: number) {
  return rnd() * (max - min) + min
}
export function getRndLinInt(rnd: () => number, min: number, max: number) {
  return Math.floor(getRndLin(rnd, min, max))
}

export function getRandomVariant<A>(rnd: () => number, variants: A[]) {
  return variants[Math.floor(rnd() * variants.length)]
}
