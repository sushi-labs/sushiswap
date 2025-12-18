import { Container } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { PoolHeader } from '~stellar/_common/ui/PoolDetails/PoolHeader'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ address: string }>
}) {
  const { children } = props
  const params = await props.params

  const address = decodeURIComponent(params.address)

  const headersList = await headers()
  const referer = headersList.get('referer')

  return (
    <>
      <Container maxWidth="5xl" className="pt-6 px-4">
        <PoolHeader
          address={address}
          backUrl={
            referer?.includes('/pool')
              ? referer?.toString()
              : `/stellar/explore/pools`
          }
        />
      </Container>
      <section className="flex flex-col flex-1 mt-2">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-6 h-full">
          {children}
        </div>
      </section>
    </>
  )
}
