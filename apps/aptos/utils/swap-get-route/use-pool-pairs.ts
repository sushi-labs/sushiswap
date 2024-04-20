import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  usePoolActions,
  usePoolState,
} from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { useNetwork } from '../hooks/useNetwork'
import { PoolReserve } from './types'

export async function usePoolPairs() {
  const {
    api: { fetchUrlPrefix },
    contracts: { swap: swapContract },
  } = useNetwork()
  const { token0, token1, isTransactionPending } = usePoolState()

  const { setPoolReserves, setLoadingPrice, setPoolPairRatio } =
    usePoolActions()

  const { data, isLoading } = useQuery<{
    poolReserves: PoolReserve | null
    poolPairRatio: number
  }>({
    queryKey: ['poolPairs', swapContract, token0, token1, isTransactionPending],
    queryFn: async () => {
      const url = `${fetchUrlPrefix}/v1/accounts/${swapContract}/resources`

      const response = await fetch(url)

      if (response.status === 200) {
        let inverse = false

        const data = await response.json()
        const reserves: PoolReserve[] = data.filter((d: PoolReserve) => {
          if (
            d.type ===
            `${swapContract}::swap::TokenPairReserve<${token0.address}, ${token1.address}>`
          ) {
            inverse = false
            return true
          } else if (
            d.type ===
            `${swapContract}::swap::TokenPairReserve<${token1.address}, ${token0.address}>`
          ) {
            inverse = true
            return true
          }
        })

        if (reserves?.length) {
          if (inverse) {
            return {
              poolReserves: reserves[0],
              poolPairRatio:
                Number(reserves[0]?.data?.reserve_x) /
                Number(reserves[0]?.data?.reserve_y),
            }
          } else {
            return {
              poolReserves: reserves[0],
              poolPairRatio:
                Number(reserves[0]?.data?.reserve_y) /
                Number(reserves[0]?.data?.reserve_x),
            }
          }
        }
      }

      return {
        poolReserves: null,
        poolPairRatio: 0,
      }
    },
    refetchInterval: 8000,
  })

  useEffect(() => {
    if (data) {
      setPoolReserves(data?.poolReserves)
      setPoolPairRatio(data?.poolPairRatio)
    }
  }, [data, setPoolReserves, setPoolPairRatio])

  useEffect(() => {
    setLoadingPrice(isLoading)
  }, [isLoading, setLoadingPrice])
}
