import { getBonds } from '@sushiswap/client'
import { BondsApiSchema } from '@sushiswap/client/api'
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
    const bonds = await getBonds(BondsApiSchema.parse(params))
    await new Promise((resolve) => setTimeout(resolve, 5000))
    return <BondsTable data={bonds} />
  }
