import { detectSnapProvider } from '@kadena/wallet-adapter-metamask-snap'
import {
  Button,
  type ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import Image from 'next/image'
import React from 'react'
import { useMemo } from 'react'
import { useIsMobile } from '~kadena/_common/lib/hooks/use-is-mobile'
import { ADAPTER_INSTALL_URLS, useKadena } from '~kadena/kadena-wallet-provider'
import { useKadenaAdapterContext } from '~kadena/providers'
import { KADENA_WALLET_ADAPTER_ICONS } from '../../../kadena-wallet-provider'

export function ConnectButton(props: ButtonProps) {
  const { adapters, handleConnect, isConnecting } = useKadena()
  const { isMobile } = useIsMobile()
  const { refreshSnapAdapter } = useKadenaAdapterContext()

  const _adapters = useMemo(() => {
    const hasEcko = adapters.some((a) => a.name === 'Ecko')
    const hasSnap = adapters.some((a) => a.name === 'Snap')

    const eckoAdapter = !hasEcko
      ? [
          {
            name: 'eckoWALLET',
            detected: false,
            installUrl: ADAPTER_INSTALL_URLS['Ecko'],
            imageURI: KADENA_WALLET_ADAPTER_ICONS['Ecko'],
          },
        ]
      : []

    const snapAdapter = {
      name: isMobile ? 'MetaMask (Desktop Only)' : 'MetaMask',
      detected: false,
      installUrl: '',
      imageURI: KADENA_WALLET_ADAPTER_ICONS['Snap'],
    }

    if (isMobile) {
      return [...adapters.filter((a) => a.name !== 'Snap'), snapAdapter]
    }

    return hasSnap
      ? [...eckoAdapter, ...adapters]
      : [...eckoAdapter, snapAdapter, ...adapters]
  }, [adapters, isMobile])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>
          {isConnecting ? (
            'Connecting'
          ) : (
            <>
              <span className="sm:hidden block">Connect</span>
              <span className="hidden sm:block">Connect Wallet</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuGroup>
          {_adapters.map((adapter) => (
            <DropdownMenuItem
              key={adapter.name}
              disabled={adapter.name.includes('MetaMask (Desktop Only)')}
              onClick={async () => {
                if (adapter.name === 'MetaMask') {
                  await detectSnapProvider({ silent: false })

                  await refreshSnapAdapter()
                  window.location.reload()
                  return
                }
                if (adapter.detected) {
                  await handleConnect(adapter.name)
                  return
                }
                window.open(adapter.installUrl, '_blank')
              }}
            >
              <>
                <Image
                  src={adapter.imageURI}
                  alt={adapter.name}
                  width={16}
                  height={16}
                  className="w-4 h-4 mr-2"
                />
                {adapter.name === 'Ecko'
                  ? 'eckoWALLET'
                  : adapter.name === 'Snap'
                    ? 'MetaMask'
                    : adapter.name}
              </>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
