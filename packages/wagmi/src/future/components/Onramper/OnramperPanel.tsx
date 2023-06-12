'use client'

import { FC, useCallback } from 'react'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { useAccount } from 'wagmi'
import { useOnramperContext } from './OnramperProvider'

export const OnramperPanel: FC = () => {
  const { address } = useAccount()
  const { open, setOpen } = useOnramperContext()
  const onClose = useCallback(() => setOpen(false), [setOpen])

  let src = 'https://buy.onramper.com?themeName=sushi&apiKey=pk_prod_01GTYEN8CHRVPKES7HK2S9JXDJ&defaultCrypto=ETH'
  if (address) {
    src += `&wallets=ETH:${address}`
  }

  return (
    <Dialog open={open} unmount={true} onClose={() => {}} maxWidth="lg">
      <Dialog.Header title="" onClose={onClose} className="mr-1" />
      <div className="flex items-center justify-center w-full h-[75vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl overflow-hidden mt-3">
        <iframe
          src={src}
          height="100%"
          width="100%"
          title="Onramper widget"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        />
      </div>
    </Dialog>
  )
}
