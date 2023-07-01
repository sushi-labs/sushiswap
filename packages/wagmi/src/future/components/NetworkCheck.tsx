import { FC, useEffect, useState } from 'react'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Chain, ChainId, chainName } from '@sushiswap/chain'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import ReactDOM from 'react-dom'

export const NetworkCheck: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const isMounted = useIsMounted()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  // Delay couple seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    if (Boolean(isMounted && chain && chainId !== chain.id)) {
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
        App network ({chainName?.[chainId]}) {"doesn't"} match network selected in wallet (
        {chain?.id ? chainName[chain.id] : ''}).
      </p>
      <div className="block flex justify-end px-3 w-full sm:w-[unset]">
        <Button
          fullWidth
          onClick={() => switchNetwork?.(chainId)}
          
          
          size="sm"
          className="whitespace-nowrap"
        >
          Switch to {Chain.fromChainId(chainId).name}
        </Button>
      </div>
    </div>,
    document.getElementById('network-check-portal') || document.body
  )
}
