import { Header } from '~evm/[chainId]/header'

export default async function PerpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
