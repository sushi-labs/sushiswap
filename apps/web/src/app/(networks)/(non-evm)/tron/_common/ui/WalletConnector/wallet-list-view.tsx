import { List, SelectIcon } from '@sushiswap/ui'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import Image from 'next/image'

export const WalletListView = () => {
  const { select, connect, wallet, wallets } = useWallet()

  return (
    <List className="flex flex-col gap-1 !p-0">
      <List.Control className="bg-gray-100 ">
        {wallets.map(({ adapter }) => (
          <List.MenuItem
            icon={() => (
              <Image
                src={adapter.icon}
                alt={adapter.name}
                width={25}
                height={25}
              />
            )}
            className="w-full items-center text-left justify-start flex"
            key={adapter.name}
            title={adapter.name}
            onClick={async () => {
              if (wallet && wallet.adapter.name === adapter.name) {
                connect()
              } else if (adapter.readyState === 'Found') {
                select(adapter.name)
              } else {
                window.open(adapter.url, '_blank')
              }
            }}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
          />
        ))}
      </List.Control>
    </List>
  )
}
