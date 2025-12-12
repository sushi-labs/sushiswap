import { Container, LinkInternal } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { getEvmChainById, isBladeChainId, isEvmAddress } from 'sushi/evm'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId } = params
  const chainId = +_chainId

  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  return (
    <section className="flex flex-1 flex-col">
      <div className="h-full border-accent border-t bg-gray-50 py-10 dark:bg-white/[0.02]">
        <Container maxWidth="7xl" className="px-4 pb-10">
          <LinkInternal
            href={`/${getEvmChainById(chainId).key}/explore/blade-pools`}
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
