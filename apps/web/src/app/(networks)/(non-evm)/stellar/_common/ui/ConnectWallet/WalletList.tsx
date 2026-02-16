import { List, SelectIcon } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useStellarWallet } from '../../../providers'

export const WalletList = () => {
  const { wallets, connectWallet } = useStellarWallet()

  const handleConnectWallet = async (walletId: string) => {
    await connectWallet(walletId)
  }

  const someUninstalled = useMemo(
    () => wallets.some((wallet) => !wallet.isAvailable),
    [wallets],
  )

  return (
    <List className="!p-0">
      <List.Control className="bg-gray-100 flex flex-col gap-1">
        {wallets.map((wallet) => {
          return (
            <List.MenuItem
              icon={() => (
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  width={25}
                  height={25}
                />
              )}
              className="relative flex-1 w-full items-center"
              key={wallet.name}
              title={
                <div className="flex flex-row justify-between items-center">
                  <div>{wallet.name}</div>
                  {!wallet.isAvailable && (
                    <div className="absolute right-5 px-1 rounded-md text-xs border border-gray-200 text-gray-500 bg-gray-100">
                      Not Installed
                    </div>
                  )}
                  {/*
                    Leave space for the "Not Installed" label
                    This is done with absolute positioning to avoid having to make changes to the shared List.MenuItem structure
                  */}
                  {someUninstalled && <div className="w-24" />}
                </div>
              }
              onClick={async () => {
                if (wallet.isAvailable) {
                  await handleConnectWallet(wallet.id)
                } else if (wallet.url) {
                  window.open(wallet.url, '_blank')
                }
              }}
              hoverIcon={() => <SelectIcon className="-rotate-90" />}
            />
          )
        })}
      </List.Control>
    </List>
  )
}
