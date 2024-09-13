import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useConfig } from 'wagmi'
import type { getAllPoolsCodeMap as GetAllPoolsCodeMap } from '../actions/getAllPoolsCodeMap'
import { UsePoolsParams } from '../types'

export const usePoolsCodeMap = ({
  enabled = true,
  ...variables
}: Omit<UsePoolsParams, 'config'>) => {
  const { chainId, currencyA, currencyB } = variables

  const [getAllPoolsCodeMap, setGetAllPoolsCodeMap] = useState<
    typeof GetAllPoolsCodeMap | undefined
  >()

  useEffect(() => {
    if (enabled && !getAllPoolsCodeMap) {
      const fetchGetAllPoolsCodeMap = async () => {
        const { getAllPoolsCodeMap } = await import(
          '../actions/getAllPoolsCodeMap'
        )
        setGetAllPoolsCodeMap(() => getAllPoolsCodeMap)
      }

      fetchGetAllPoolsCodeMap()
    }
  }, [getAllPoolsCodeMap, enabled])

  const config = useConfig()

  return useQuery({
    queryKey: [
      'usePoolsCodeMap',
      {
        chainId,
        currencyA,
        currencyB,
        getAllPoolsCodeMap: typeof getAllPoolsCodeMap === 'undefined',
      },
    ],
    queryFn: async () => {
      if (!getAllPoolsCodeMap)
        throw new Error('getAllPoolsCodeMap is not loaded')

      return getAllPoolsCodeMap({ ...variables, config })
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && getAllPoolsCodeMap),
  })
}
