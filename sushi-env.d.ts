/// <reference types="gtag.js" />

declare module 'gtag.js'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import Fraction from './src/entities/bignumber/Fraction'

declare global {
  interface String {
    toBigNumber(decimals: number): BigNumber
  }
  interface Window {
    walletLinkExtension?: any
    ethereum?: {
      isCoinbaseWallet?: true
      isMetaMask?: true
      on?: (...args: any[]) => void
      removeListener?: (...args: any[]) => void
      removeAllListeners?: (...args: any[]) => void
      autoRefreshOnNetworkChange?: boolean
    }
    web3?: Record<string, unknown>
  }
}

// Used by Ethers.js
interface CustomError extends Error {
  reason?: string
}

// Polyfill for ResizeObserver since type is missing from TS
// https://github.com/que-etc/resize-observer-polyfill/blob/master/src/index.d.ts
interface DOMRectReadOnly {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
}

interface ResizeObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  disconnect(): void
}

declare const ResizeObserver: {
  prototype: ResizeObserver
  new (callback: ResizeObserverCallback): ResizeObserver
}

interface ResizeObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  disconnect(): void
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): {
    code: number
    name: string
    length: number
    digest: Uint8Array
  }
  declare function toB58String(hash: Uint8Array): string
}

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

declare module 'formatic'

declare module '@ethersproject/bignumber' {
  interface BigNumber {
    mulDiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
    toFixed(decimals: BigNumberish): string
    toFraction(decimals: BigNumberish, base: BigNumberish): Fraction
    min(...values: BigNumberish[]): BigNumber
    max(...values: BigNumberish[]): BigNumber
  }
}
