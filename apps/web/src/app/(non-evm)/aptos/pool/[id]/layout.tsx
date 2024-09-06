'use client'

import { Container } from '@sushiswap/ui'
import { Breadcrumb } from '@sushiswap/ui'
import { useParams } from 'next/navigation'
import { PoolHeader } from '~aptos/(common)/components/PoolSection/PoolHeader'
import { usePool } from '~aptos/pool/lib/use-pool'

export default function Layout({
  children,
}: { children: React.ReactNode; params: { id: string } }) {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id as string)
  const { data: pool } = usePool(tokenAddress)

  return (
    <>
      <Container maxWidth="5xl" className="px-4">
        <Breadcrumb />
      </Container>
      <Container maxWidth="5xl" className="pt-10 px-4">
        {pool ? <PoolHeader row={pool} /> : null}
      </Container>
      <section className="flex flex-col flex-1 pb-10 h-full">
        {children}
      </section>
    </>
  )
}
