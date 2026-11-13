import { notFound, redirect } from 'next/navigation'
import { isUnifiedSwapChainId } from 'src/lib/swap/unified-swap'
import { getChainById } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'

export default async function CrossChainSwapPage({
  params,
  searchParams,
}: {
  params: Promise<{ chainId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const chainId = Number((await params).chainId)
  if (!isUnifiedSwapChainId(chainId)) return notFound()
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') query.set(key, value)
    else if (value) for (const entry of value) query.append(key, entry)
  }
  if (!query.has('chainId1'))
    query.set(
      'chainId1',
      String(
        chainId === EvmChainId.ARBITRUM || chainId === StellarChainId.STELLAR
          ? EvmChainId.ETHEREUM
          : EvmChainId.ARBITRUM,
      ),
    )
  redirect(`/${getChainById(chainId).key}/swap?${query}`)
}
