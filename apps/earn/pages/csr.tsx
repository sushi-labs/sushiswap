import { PoolType } from '@sushiswap/client'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { z } from 'zod'
import { Pools as _Pools } from '../components'

const schema = z.object({
  chainIds: z
    .string()
    .transform((chainIds) => chainIds.split(',').map((chainId) => Number(chainId)))
    .optional(),
  poolTypes: z
    .string()
    .optional()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  incentivizedOnly: z.string().optional().transform(Boolean),
})

const Pools: FC = () => {
  const { query, isReady } = useRouter()

  console.log({ isReady, query })

  const filters = useMemo(() => (query ? schema.parse(query) : undefined), [query])

  return <_Pools filters={filters} />
}

export default Pools
