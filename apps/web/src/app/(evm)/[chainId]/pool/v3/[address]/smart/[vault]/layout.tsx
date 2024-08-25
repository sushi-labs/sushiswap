import { getVault } from '@sushiswap/graph-client/data-api'
import { Container, LinkInternal } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import React from 'react'
import { ChainId, ChainKey } from 'sushi/chain'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string; vault: string; address: string }
}) {
  const { chainId: _chainId, address, vault: vaultAddress } = params
  const chainId = +_chainId as ChainId

  const vault = await unstable_cache(
    async () =>
      await getVault({
        chainId,
        vaultAddress,
      }),
    ['vault', `${chainId}:${vaultAddress}`],
    { revalidate: 60 * 15 },
  )()

  if (!vault) {
    notFound()
  }

  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={`/${ChainKey[chainId]}/pool/v3/${address}/smart`}
          className="text-sm text-blue hover:underline"
        >
          ← Strategies
        </LinkInternal>
        {vault.isDeprecated && (
          <div className="text-center text-red dark:text-red-600 w-full">
            <div className=" font-medium">This vault is deprecated.</div>
            <div className="text-sm">
              {"It will not accrue any fees and won't be readjusted."}
            </div>
          </div>
        )}

        {children}
      </div>
    </Container>
  )
}
