import { Providers } from './providers'

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const { children } = props

  return (
    <Providers>
      <div
        className="fixed inset-0 -z-10 bg-no-repeat bg-cover bg-left
          bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,255,255,0.80)_8.1%,_rgba(255,255,255,0)_100%),url('/katana-bg-light.jpg')]
          dark:bg-[linear-gradient(180deg,_#0F172A_0%,_rgba(15,23,42,0.80)_8.1%,_rgba(15,23,42,0)_100%),url('/katana-bg-dark.jpg')]"
      />
      {children}
    </Providers>
  )
}
