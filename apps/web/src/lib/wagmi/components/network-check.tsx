'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { FC, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { EvmChain, EvmChainId, evmChainName } from 'sushi/chain'
import { useAccount, useSwitchChain } from 'wagmi'

export const NetworkCheck: FC<{ chainId: EvmChainId }> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const isMounted = useIsMounted()
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  // Delay couple seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    if (isMounted && chain && chainId !== chain.id) {
      timeout = setTimeout(() => setOpen(true), 1500)
    } else {
      setOpen(false)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [chain, isMounted, chainId])

  if (!open) return <></>

  return ReactDOM.createPortal(
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center bg-gray-200 border-gray-300 dark:bg-slate-800 text-gray-900 dark:text-slate-400 w-full py-3 font-medium border-b dark:border-slate-200/10">
      <p className="px-4">
        App network ({evmChainName?.[chainId]}) {"doesn't"} match network
        selected in wallet ({chain?.id ? evmChainName[chain.id] : ''}).
      </p>
      <div className="block flex justify-end px-3 w-full sm:w-[unset]">
        <Button
          fullWidth
          onClick={() => switchChain?.({ chainId })}
          size="sm"
          className="whitespace-nowrap"
        >
          Switch to {EvmChain.fromChainId(chainId)?.name}
        </Button>
      </div>
    </div>,
    document.getElementById('network-check-portal') || document.body,
  )
}
