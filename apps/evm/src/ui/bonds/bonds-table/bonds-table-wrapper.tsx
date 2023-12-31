import { getBonds, getBondsUrl } from '@sushiswap/client'
import { BondsApiSchema } from '@sushiswap/client/api'
import { unstable_cache } from 'next/cache'
import { FC, Suspense } from 'react'
import { BondsTable } from '..'

export const BondsTableWrapper: FC<{ params: typeof BondsApiSchema._input }> =
  async ({ params }) => {
    return (
      <Suspense
        key={JSON.stringify(params)}
        fallback={<BondsTable data={[]} isLoading={true} />}
      >
        <_BondsTableWrapper params={params} />
      </Suspense>
    )
  }

const _BondsTableWrapper: FC<{ params: typeof BondsApiSchema._input }> =
  async ({ params }) => {
    const args = BondsApiSchema.parse(params)

    const bonds = await unstable_cache(
      async () => getBonds(args),
      ['bonds', getBondsUrl(args)],
      {
        revalidate: 2,
      },
    )()
    return <BondsTable data={bonds} />
  }
