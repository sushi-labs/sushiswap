import { useKadenaWallet } from '@kadena/wallet-adapter-react'
import { List, SelectIcon } from '@sushiswap/ui'
import Image from 'next/image'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const WalletListView = () => {
  const { adapters, handleConnect } = useKadena()
  const { adapters: adapters2, client } = useKadenaWallet()

  console.log({
    adapters2,
    client,
  })

  return (
    <List className="flex flex-col gap-1 !p-0">
      <List.Control className="bg-gray-100">
        {/* @ts-ignore */}
        {client.adapters.length === 0 ? (
          <div className="p-3 text-sm">No wallets found</div>
        ) : (
          adapters.map((adapter) => (
            <List.MenuItem
              icon={() => (
                <Image
                  src={adapter.imageURI}
                  alt={adapter.name}
                  width={12}
                  height={12}
                />
              )}
              className="flex items-center justify-start w-full px-0 text-left"
              key={adapter.name}
              title={adapter.name}
              onClick={() => handleConnect(adapter.name)}
              hoverIcon={() => <SelectIcon className="-rotate-90" />}
            />
          ))
        )}
      </List.Control>
    </List>
  )
}
