import { List, SelectIcon } from '@sushiswap/ui'
import Image from 'next/image'
import { useWalletAdaptersContext } from '~kadena/wallet-adapters-provider'

export const WalletListView = () => {
  const { adapters } = useWalletAdaptersContext()

  return (
    <List className="flex flex-col gap-1 !p-0">
      <List.Control className="bg-gray-100 ">
        {adapters.map((adapter) => (
          <List.MenuItem
            icon={() => (
              <Image
                src={adapter.icon}
                alt={adapter.name}
                width={25}
                height={25}
              />
            )}
            className="w-full items-center text-left justify-start flex px-0"
            key={adapter.name}
            title={adapter.name}
            onClick={adapter.onClick}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
            disabled={adapter.readyState === 'NotDetected'}
          />
        ))}
      </List.Control>
    </List>
  )
}
