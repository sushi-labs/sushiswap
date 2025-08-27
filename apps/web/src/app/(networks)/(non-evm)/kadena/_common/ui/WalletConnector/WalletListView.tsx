import { detectSnapProvider } from '@kadena/wallet-adapter-metamask-snap'
import { List, SelectIcon, classNames } from '@sushiswap/ui'
import Image from 'next/image'
import { useMemo } from 'react'
import { useIsMobile } from '~kadena/_common/lib/hooks/use-is-mobile'
import { ADAPTER_INSTALL_URLS, useKadena } from '~kadena/kadena-wallet-provider'
import { useKadenaAdapterContext } from '~kadena/providers'
import { KADENA_WALLET_ADAPTER_ICONS } from '../../../kadena-wallet-provider'

export const WalletListView = () => {
  const { adapters, handleConnect } = useKadena()
  const { refreshSnapAdapter } = useKadenaAdapterContext()
  const { isMobile } = useIsMobile()

  const _adapters = useMemo(() => {
    if (isMobile) {
      const realAdapters = adapters.filter((adapter) => adapter.name !== 'Snap')
      return [
        {
          name: 'MetaMask (Desktop Only)',
          detected: false,
          installUrl: '',
          imageURI: KADENA_WALLET_ADAPTER_ICONS['Snap'],
        },
        ...realAdapters,
      ]
    }

    const hasSnap = adapters.find((adapter) => adapter.name === 'Snap')

    const hasEcko = adapters.find((adapter) => adapter.name === 'Ecko')
    if (!hasSnap) {
      return [
        {
          name: 'MetaMask ',
          detected: false,
          installUrl: '',
          imageURI: KADENA_WALLET_ADAPTER_ICONS['Snap'],
        },
        ...(!hasEcko
          ? [
              {
                name: 'eckoWALLET',
                detected: false,
                installUrl: ADAPTER_INSTALL_URLS['Ecko'],
                imageURI: KADENA_WALLET_ADAPTER_ICONS['Ecko'],
              },
            ]
          : []),
        ...adapters,
      ]
    }
    return adapters
  }, [adapters, isMobile])

  return (
    <List className={`flex flex-col gap-1 !bg-transparent !p-0`}>
      <List.Control className="border-none !bg-transparent">
        {_adapters.map((adapter) => (
          <List.MenuItem
            icon={() => (
              <Image
                src={adapter.imageURI}
                alt={adapter.name}
                width={25}
                height={25}
                className="max-h-[25px]"
              />
            )}
            className={classNames(
              'flex items-center justify-start w-full min-w-[180px] text-left',
            )}
            key={adapter.name}
            title={
              adapter.name === 'Ecko'
                ? 'eckoWALLET'
                : adapter.name === 'Snap'
                  ? 'MetaMask'
                  : adapter.name
            }
            disabled={adapter.name === 'MetaMask (Desktop Only)'}
            onClick={async () => {
              if (adapter.name === 'MetaMask ') {
                await detectSnapProvider({ silent: false })
                await refreshSnapAdapter()
                //reload the page to ensure the snap is detected
                window.location.reload()
                return
              }
              console.log(adapter)
              if (adapter.detected) {
                await handleConnect(adapter.name)
                return
              }
              window.open(adapter.installUrl, '_blank')
            }}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
          />
        ))}
      </List.Control>
    </List>
  )
}
