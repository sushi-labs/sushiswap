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
