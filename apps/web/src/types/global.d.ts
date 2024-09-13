import type { Address } from 'viem'

export declare global {
  interface String {
    toLowerCase<T extends string>(this: T): T extends Address ? Address : string
  }
}
