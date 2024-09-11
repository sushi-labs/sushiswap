import { Token } from 'sushi/currency'

export const delay = async (ms: number) =>
  new Promise((res) => setTimeout(res, ms))

export function isNative(t: Token) {
  return t.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
}

export class Average {
  sum = 0
  num = 0

  add(n: number) {
    if (!Number.isNaN(n)) {
      this.sum += n
      this.num += 1
    }
  }

  avg(): number | undefined {
    return this.num === 0 ? undefined : this.sum / this.num
  }
}
