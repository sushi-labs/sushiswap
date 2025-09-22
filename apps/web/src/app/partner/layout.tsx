import type { Metadata } from 'next'
import { Header } from './header'

export const metadata: Metadata = {
  title: 'Partner',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col flex-1">{children}</div>
    </>
  )
}
