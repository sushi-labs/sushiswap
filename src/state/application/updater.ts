import { ChainId } from '@sushiswap/core-sdk'
import useDebounce from 'app/hooks/useDebounce'
import useIsWindowVisible from 'app/hooks/useIsWindowVisible'
import { useActiveWeb3React } from 'app/services/web3'
import { useEffect, useState } from 'react'

import { useAppDispatch } from '../hooks'
import { updateChainId } from './reducer'

/**
 * Returns the input chain ID if chain is supported. If not, return undefined
 * @param chainId a chain ID, which will be returned if it is a supported chain ID
 */
export function supportedChainId(chainId: number | undefined): ChainId | undefined {
  if (typeof chainId === 'number' && chainId in ChainId) {
    return chainId
  }
  return undefined
}

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const windowVisible = useIsWindowVisible()

  const [activeChainId, setActiveChainId] = useState(chainId)

  useEffect(() => {
    if (library && chainId && windowVisible) {
      setActiveChainId(chainId)
    }
  }, [dispatch, chainId, library, windowVisible])

  const debouncedChainId = useDebounce(activeChainId, 100)

  useEffect(() => {
    const chainId = debouncedChainId ? supportedChainId(debouncedChainId) ?? null : null
    dispatch(updateChainId({ chainId }))
  }, [dispatch, debouncedChainId])

  return null
}
