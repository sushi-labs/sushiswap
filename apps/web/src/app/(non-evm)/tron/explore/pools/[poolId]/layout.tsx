import { RemoveProvider } from './remove-provider'

export default function RemoveLiqLayout({
  children,
}: { children: React.ReactNode }) {
  return <RemoveProvider>{children}</RemoveProvider>
}
