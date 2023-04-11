import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { poolFiltersSchema, Pools as _Pools } from '../components'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'

const Pools: FC = () => {
  const { query } = useRouter()

  const filters = useMemo(() => (query ? poolFiltersSchema.parse(query) : undefined), [query])

  return (
    <SplashController>
      <_Pools filters={filters} />
    </SplashController>
  )
}

export default Pools
