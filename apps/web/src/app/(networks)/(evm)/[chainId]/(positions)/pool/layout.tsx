import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Positions',
  description:
    'Manage your liquidity on SushiSwap: add or remove liquidity, track all your positions and claim fees.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
