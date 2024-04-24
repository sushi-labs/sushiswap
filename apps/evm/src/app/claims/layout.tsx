import { Providers } from './providers'

export default function ClaimsLayout({
  children,
}: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
