import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Bonds 📝',
}

export default function BondsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <div className="flex flex-col flex-1">{children}</div>
      </Providers>
    </>
  )
}
