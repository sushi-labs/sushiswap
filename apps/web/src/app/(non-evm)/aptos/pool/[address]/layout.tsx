import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { PoolHeader } from '~aptos/(common)/components/PoolSection/PoolHeader'

export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { address: string } }) {
  const address = decodeURIComponent(params.address)

  const headersList = headers()
  const referer = headersList.get('referer')

  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      <PoolHeader
        backUrl={
          referer?.includes('/pool')
            ? referer?.toString()
            : `/aptos/explore/pools`
        }
        address={address}
      />
      <section>{children}</section>
    </Container>
  )
}
