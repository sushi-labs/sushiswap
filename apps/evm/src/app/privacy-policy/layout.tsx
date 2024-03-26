import { Metadata } from 'next'
import { Header } from '../swap/header'
import { Providers } from '../swap/providers'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <div className="flex flex-col flex-1">{children}</div>
      </Providers>
    </>
  )
}
