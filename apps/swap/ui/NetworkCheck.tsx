import { FC, useEffect, useState } from 'react'
import { useSwapState } from './trade/TradeProvider'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/future/components/button'
import { Chain, chainName } from '@sushiswap/chain'
import { Collapsible } from '@sushiswap/ui/future/components/animation/Collapsible'

export const NetworkCheck: FC = () => {
  const [open, setOpen] = useState(false)
  const isMounted = useIsMounted()
  const { network0 } = useSwapState()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  // Delay couple seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    if (Boolean(isMounted && chain && network0 !== chain.id)) {
      timeout = setTimeout(() => setOpen(true), 1500)
    } else {
      setOpen(false)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [chain, isMounted, network0])

  return (
    <Collapsible open={open}>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center bg-blue/20 text-blue-900 dark:text-blue-300 dark:bg-blue/25 w-full py-3 font-medium">
        <p className="px-4">
          App network ({chainName?.[network0]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}){' '}
          {"doesn't"} match network selected in wallet (
          {chain?.id ? chainName?.[chain.id]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim() : ''}).
        </p>
        <div className="block flex justify-end px-3 w-full sm:w-[unset]">
          <Button
            fullWidth
            onClick={() => switchNetwork?.(network0)}
            variant="filled"
            color="blue"
            size="sm"
            className="whitespace-nowrap"
          >
            Switch to {Chain.fromChainId(network0).name}
          </Button>
        </div>
      </div>
    </Collapsible>
  )
}
