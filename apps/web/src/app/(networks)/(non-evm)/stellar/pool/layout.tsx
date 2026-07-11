import type { Metadata } from 'next'

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
      <main className="animate-slide">{children}</main>
    </>
  )
}
