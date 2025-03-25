import { List, SelectIcon } from '@sushiswap/ui'
import Image from 'next/image'

// @TODO: replace prop with hook during integration
export const WalletListView = ({
  setIsConnecting,
}: {
  setIsConnecting: () => void
}) => {
  const adapters = [
    {
      name: 'Metamask',
      icon: 'https://images.ctfassets.net/clixtyxoaeas/1ezuBGezqfIeifWdVtwU4c/d970d4cdf13b163efddddd5709164d2e/MetaMask-icon-Fox.svg',
      readyState: 'Found',
    },
  ]

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
            className="w-full items-center text-left justify-start flex"
            key={adapter.name}
            title={adapter.name}
            onClick={async () => {
              if (adapter.readyState === 'Found') {
                setIsConnecting()
              }
            }}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
          />
        ))}
      </List.Control>
    </List>
  )
}
