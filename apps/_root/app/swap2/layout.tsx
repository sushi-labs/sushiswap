import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap 🍣 | Sushi',
}

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
