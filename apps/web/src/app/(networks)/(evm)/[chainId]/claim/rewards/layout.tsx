import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Rewards',
  description: 'Claim your rewards from SushiSwap.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
