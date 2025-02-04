import { type QueryKey, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import type { EvmChainId } from 'sushi/chain'
import { useBlockNumber } from 'wagmi'

type UseWatchByBlockKey = {
  key: QueryKey
  keys?: never
}

type UseWatchByBlockKeys = {
  key?: never
  keys: QueryKey[]
}

type UseWatchByBlock = {
  chainId: EvmChainId | undefined
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
      queryClient.invalidateQueries({ queryKey: key })
    })
  }, [blockNumber, keys, queryClient, modulo])
}
