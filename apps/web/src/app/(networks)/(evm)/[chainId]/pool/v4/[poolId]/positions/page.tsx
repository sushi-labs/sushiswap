import { Container } from '@sushiswap/ui'
import { V4Positions } from './v4-positions'

export default async function Page(props: {
  params: Promise<{ chainId: string; poolId: `0x${string}` }>
}) {
  const { chainId, poolId } = await props.params

  return (
    <section className="flex flex-col flex-1 mt-4">
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent py-10 h-full">
        <Container maxWidth="5xl" className="px-4">
          <V4Positions chainId={+chainId} poolId={poolId} />
        </Container>
      </div>
    </section>
  )
}
