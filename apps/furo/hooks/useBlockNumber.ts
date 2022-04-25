import { atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useEffect, useState } from 'react'
import { useNetwork, useProvider } from 'wagmi'
import useDebounce from './useDebounce'
import useIsWindowVisible from './useIsWindowVisible'


function useBlock() {
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id
  const provider = useProvider()
  const windowVisible = useIsWindowVisible()
  const [state, setState] = useState<{ chainId?: number; block?: number }>({ chainId })

  const onBlock = useCallback(
    (block: number) => {
      setState((state) => {
        if (state.chainId === chainId) {
          if (typeof state.block !== 'number') return { chainId, block }
          return { chainId, block: Math.max(block, state.block) }
        }
        return state
      })
    },
    [chainId],
  )

  useEffect(() => {
    if (provider && chainId && windowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setState((state) => (state.chainId === chainId ? state : { chainId }))

      provider
        .getBlockNumber()
        .then(onBlock)
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${chainId}`, error)
        })
      provider.on('block', onBlock)
      return () => {
        provider.off('block', onBlock)
      }
    }
    return undefined
  }, [chainId, provider, onBlock, windowVisible])

  const debouncedBlock = useDebounce(state.block, 100)
  return state.block ? debouncedBlock : undefined
}

const blockAtom = atom<number>(0)

export function BlockUpdater() {
  const setBlock = useUpdateAtom(blockAtom)
  const block = useBlock()
  useEffect(() => {
    setBlock(block)
  }, [block, setBlock])
  return null
}

export default function useBlockNumber(): number | undefined {
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id
  const block = useAtomValue(blockAtom)
  return chainId ? block : undefined
}
