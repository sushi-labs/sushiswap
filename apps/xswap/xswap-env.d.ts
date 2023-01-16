declare module 'tailwindcss/resolveConfig'

export declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}
