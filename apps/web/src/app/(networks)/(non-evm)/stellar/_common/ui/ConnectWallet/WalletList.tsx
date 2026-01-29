import { List, SelectIcon } from '@sushiswap/ui'
import { useStellarWallet } from '../../../providers'

export const WalletList = () => {
  const { wallets, connectWallet } = useStellarWallet()

  const handleConnectWallet = async (walletId: string) => {
    await connectWallet(walletId)
  }

  return (
    <List className="flex flex-col gap-1 !p-0">
      <List.Control className="bg-gray-100 ">
        {wallets.map((wallet) => (
          <List.MenuItem
            icon={() => (
              <img src={wallet.icon} alt={wallet.name} width={25} height={25} />
            )}
            className="w-full items-center text-left justify-start flex"
            key={wallet.name}
            title={wallet.name}
            onClick={async () => await handleConnectWallet(wallet.id)}
            hoverIcon={() => <SelectIcon className="-rotate-90" />}
          />
        ))}
      </List.Control>
    </List>
  )
}
