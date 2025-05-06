import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Fees',
  description: 'Claim your fees from SushiSwap.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
