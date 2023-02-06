import { FC, useEffect, useState } from 'react'
import { useSwapState } from './trade/TradeProvider'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui13/components/button'
import { Chain } from '@sushiswap/chain'
import { Collapsible } from '@sushiswap/ui13/components/animation/Collapsible'

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
      <div className="flex flex-col gap-4 bg-blue/20 text-blue-900 dark:text-blue-300 dark:bg-blue/25 w-full py-3 rounded-xl font-medium">
        <p className="px-4">
          App network ({Chain.from(network0).name}) {"doesn't"} match network selected in wallet (
          {chain?.id ? Chain.from(chain.id).name : ''}).
        </p>
        <div className="flex justify-end px-3">
          <Button fullWidth onClick={() => switchNetwork?.(network0)} variant="filled" color="blue" size="lg">
            Change Network
          </Button>
        </div>
      </div>
    </Collapsible>
  )
}
