import { getV3Pool, getVault } from '@sushiswap/graph-client/data-api'
import { Breadcrumb, Container, LinkInternal } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import { PoolHeader } from 'src/ui/pool/PoolHeader'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string; vault: string; address: string }
}) {
  const pool = await unstable_cache(
    async () =>
      await getV3Pool({
        chainId: Number(params.chainId),
        address: params.address,
      }),
    ['pool', `${params.chainId}:${params.address}`],
    { revalidate: 60 * 15 },
  )()

  const vault = await unstable_cache(
    async () =>
      await getVault({
        chainId: Number(params.chainId),
        vaultAddress: params.vault,
      }),
    ['vault', `${params.chainId}:${params.vault}`],
    { revalidate: 60 * 15 },
  )()

  if (!vault || !pool) {
    notFound()
  }

  const headersList = headers()
  const referer = headersList.get('referer')

  return (
    <>
      <Container maxWidth="5xl" className="px-4">
        <Breadcrumb />
      </Container>
      <Container maxWidth="5xl" className="px-4 pt-10">
        <PoolHeader
          backUrl={referer?.includes('/pool?') ? referer.toString() : '/pool'}
          address={vault.poolAddress}
          pool={pool}
          apy={{
            rewards: vault?.incentiveApr,
            fees: vault?.feeApr1d,
            vault: vault?.stakedApr1d,
          }}
        />
      </Container>
      <section className="flex flex-col flex-1 mt-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-10 pb-20 h-full">
          {' '}
          <div className="flex flex-col gap-4">
            <Container maxWidth="5xl" className="px-2 sm:px-4">
              {vault.isDeprecated && (
                <div className="text-center text-red dark:text-red-600 w-full">
                  <div className=" font-medium">This vault is deprecated.</div>
                  <div className="text-sm">
                    {"It will not accrue any fees and won't be readjusted."}
                  </div>
                </div>
              )}
              <LinkInternal
                href={`/pool/${vault.poolAddress}/smart`}
                className="text-sm text-blue hover:underline"
              >
                ← Strategies
              </LinkInternal>
            </Container>
            <Container maxWidth="screen-3xl" className="px-2 sm:px-4">
              {children}
            </Container>
          </div>
        </div>
      </section>
    </>
  )
}
