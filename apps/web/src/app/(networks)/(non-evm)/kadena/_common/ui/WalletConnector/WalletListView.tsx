import { List, SelectIcon } from '@sushiswap/ui'
import Image from 'next/image'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const WalletListView = ({
  isFullWidth = false,
}: { isFullWidth?: boolean }) => {
  const { adapters, handleConnect } = useKadena()
  return (
    <List
      className={`flex flex-col gap-1 !p-0 ${
        isFullWidth
          ? '[width:calc(var(--radix-popover-trigger-width)_-_10px)]'
          : ''
      }`}
    >
      <List.Control className="bg-gray-100">
        {adapters.map((adapter) => (
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
            onClick={() => {
              adapter.detected
                ? handleConnect(adapter.name)
                : window.open(adapter.installUrl, '_blank')
            }}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
          />
        ))}
      </List.Control>
    </List>
  )
}
