import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My V4 Fees',
  description: 'Claim your SushiSwap V4 position fees.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
