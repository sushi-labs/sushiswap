import { detectSnapProvider } from '@kadena/wallet-adapter-metamask-snap'
import { List, SelectIcon } from '@sushiswap/ui'
import Image from 'next/image'
import { useMemo } from 'react'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useKadenaAdapterContext } from '~kadena/providers'
import { KADENA_WALLET_ADAPTER_ICONS } from '../../../kadena-wallet-provider'

export const WalletListView = ({
  isFullWidth = false,
}: { isFullWidth?: boolean }) => {
  const { adapters, handleConnect } = useKadena()
  const { refreshSnapAdapter } = useKadenaAdapterContext()

  const _adapters = useMemo(() => {
    const hasSnap = adapters.find((adapter) => adapter.name === 'Snap')
    if (!hasSnap) {
      return [
        {
          name: 'MetaMask ',
          detected: false,
          installUrl: '',
          imageURI: KADENA_WALLET_ADAPTER_ICONS['Snap'],
        },
        ...adapters,
      ]
    }
    return adapters
  }, [adapters])

  return (
    <List
      className={`flex flex-col gap-1 !p-0 ${
        isFullWidth
          ? '[width:calc(var(--radix-popover-trigger-width)_-_10px)]'
          : ''
      }`}
    >
      <List.Control className="bg-gray-100">
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
            className="flex items-center justify-start w-full min-w-[180px] text-left"
            key={adapter.name}
            title={
              adapter.name === 'Ecko'
                ? 'eckoWALLET'
                : adapter.name === 'Snap'
                  ? 'MetaMask'
                  : adapter.name
            }
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
