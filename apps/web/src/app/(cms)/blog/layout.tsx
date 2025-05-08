import { Providers } from './providers'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
