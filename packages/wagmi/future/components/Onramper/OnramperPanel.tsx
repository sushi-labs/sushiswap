import { FC, useCallback, useEffect, useRef } from 'react'
import { Dialog } from '@sushiswap/ui'
import { useAccount } from 'wagmi'
import { useOnramperContext } from './OnramperProvider'
import { useMediaQuery } from '@sushiswap/hooks'

export const OnramperPanel: FC = () => {
  const { address } = useAccount()
  const { open, setOpen } = useOnramperContext()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframe = iframeRef.current
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' })
  const onClose = useCallback(() => setOpen(false), [setOpen])

  let src = 'https://buy.onramper.com?apiKey=pk_prod_01GTYEN8CHRVPKES7HK2S9JXDJ&defaultCrypto=ETH'
  if (address) {
    src += `&wallets=ETH:${address}`
  }

  useEffect(() => {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'change-theme',
          id: 'change-theme',
          theme: isDark
            ? {
                primaryColor: '#3c82f6ff',
                secondaryColor: '#2c3647ff',
                primaryTextColor: '#ffffff',
                secondaryTextColor: '#8895abff',
                containerColor: '#10172aff',
                cardColor: '#1e293bff',
                borderRadius: '1rem',
                widgetBorderRadius: '0rem',
              }
            : {
                primaryColor: '#3c82f6ff',
                secondaryColor: '#f0f0f0ff',
                primaryTextColor: '#111827ff',
                secondaryTextColor: '#4b5563ff',
                containerColor: '#f3f4f6ff',
                cardColor: '#ffffffff',
                borderRadius: '1rem',
                widgetBorderRadius: '0rem',
              },
        },
        '*'
      )
    }
  }, [iframe])

  return (
    <Dialog open={open} unmount={false} onClose={onClose}>
      <div className="flex items-center justify-center w-full h-[75vh] sm:w-[482px] sm:h-[660px] rounded-t-2xl sm:rounded-2xl overflow-hidden">
        <iframe
          ref={iframeRef}
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
