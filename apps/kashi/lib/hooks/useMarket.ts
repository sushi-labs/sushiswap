import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'

import { KashiPair } from '.graphclient'

export const useMarket = () => {
  const router = useRouter()
  const { data } = useSWR<KashiPair>(`/kashi/api/pair/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )
  return useMemo(() => (data ? new KashiMediumRiskLendingPairV1(data) : undefined), [data])
}
