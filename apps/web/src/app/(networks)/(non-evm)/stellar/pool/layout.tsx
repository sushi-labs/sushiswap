import type { Metadata } from 'next'
import { Header } from '../header'

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap and permissionless market making for liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="lg:p-4 mb-[86px] animate-slide">{children}</main>
    </>
  )
}
