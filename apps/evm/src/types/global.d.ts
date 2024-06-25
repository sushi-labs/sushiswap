export declare global {
  interface Window {
    useSwapApi?: boolean
  }
}

declare module '*.png' {
  const value: any
  export = value
}
