import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Partner',
}

export default function PartnerLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Header />
      <div className="flex items-center justify-center w-full my-10">{children}</div>
    </Providers>
  )
}
