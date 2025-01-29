import {
  type VaultV1,
  getVault,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; vault: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = Number(params.chainId) as EvmChainId
  const vaultAddress = params.vault

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(vaultAddress, { strict: false })
  ) {
    return notFound()
  }

  const vault = (await unstable_cache(
    async () =>
      await getVault({
        chainId,
        vaultAddress,
      }),
    ['vault', `${params.chainId}:${params.vault}`],
    { revalidate: 60 * 15 },
  )()) as NonNullable<VaultV1>

  return (
    <Container maxWidth="5xl" className="px-4">
      {vault.isDeprecated && (
        <div className="text-center text-red dark:text-red-600 w-full pb-8">
          <div className=" font-medium">This vault is deprecated.</div>
          <div className="text-sm">
            {"It will not accrue any fees and won't be readjusted."}
          </div>
        </div>
      )}
      {children}
    </Container>
  )
}
