/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

declare global {
  interface Window {
    TradingView: {
      widget: new (options: any) => any
    }
    Datafeeds: {
      UDFCompatibleDatafeed: new (url: string) => any
    }
  }
}
