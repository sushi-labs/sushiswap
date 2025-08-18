import { type BladePool, getBladePool } from '@sushiswap/graph-client/data-api'
import { Container, LinkInternal } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PoolHeader } from 'src/ui/pool/PoolHeader'
import { ChainKey, type EvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  // const pool = await unstable_cache(
  //   async () => getBladePool({ chainId, address }),
  //   ['blade', 'pool', `${chainId}:${address}`],
  //   {
  //     revalidate: 60 * 15,
  //   },
  // )()

  return (
    <section className="flex flex-1 flex-col">
      <div className="h-full border-accent border-t bg-gray-50 py-10 dark:bg-white/[0.02]">
        <Container maxWidth="7xl" className="px-4 pb-10">
          <LinkInternal
            href={`/${ChainKey[chainId]}/explore/blade-pools`}
            className="text-blue text-sm hover:underline"
          >
            ← Back
          </LinkInternal>
        </Container>
        {children}
      </div>
    </section>
  )
}
