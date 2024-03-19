import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { useBlockNumber } from 'wagmi'

type UseWatchByBlockKey = {
  key: QueryKey
  keys: undefined
}

type UseWatchByBlockKeys = {
  key: undefined
  keys: QueryKey[]
}

type UseWatchByBlock = {
  chainId: ChainId
  // Refresh every modulo blocks
  modulo?: number
} & (UseWatchByBlockKey | UseWatchByBlockKeys)

export function useWatchByBlock({
  keys: _keys,
  key,
  chainId,
  modulo,
}: UseWatchByBlock) {
  const keys = useMemo(() => {
    if (key) return [key]
    if (_keys) return _keys
    return []
  }, [_keys, key])

  const { data: blockNumber } = useBlockNumber({ chainId, watch: true })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!blockNumber || !keys.length) return

    if (modulo && blockNumber % BigInt(modulo) !== 0n) return

    keys.forEach((key) => {
      queryClient.invalidateQueries(key)
    })
  }, [blockNumber, keys, queryClient, modulo])
}
