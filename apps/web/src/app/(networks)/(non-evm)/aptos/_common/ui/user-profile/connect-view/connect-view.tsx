import { type WalletName, useWallet } from '@aptos-labs/wallet-adapter-react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { List } from '@sushiswap/ui'
import type React from 'react'
import type { FC } from 'react'
import { NotFoundWalletList } from './not-found-wallet-list'

export const ConnectView: FC<{ close(): void }> = ({ close }) => {
  const { wallets, connect } = useWallet()

  const onSelect = (name: WalletName) => {
    connect(name)
    close()
  }

  return (
    <List className="!p-0">
      <List.Control className="bg-gray-100 dark:!bg-slate-700">
        {wallets?.map((wallet) => {
          if (wallet.readyState === 'Installed') {
            return (
              <List.MenuItem
                className="p-0"
                onClick={() => onSelect(wallet.name as WalletName)}
                title={wallet.name}
                icon={(props: React.ComponentProps<'img'>) => (
                  <img src={wallet.icon} {...props} alt={wallet.name} />
                )}
                key={wallet.name}
                hoverIcon={ChevronRightIcon}
              />
            )
          } else {
            return <NotFoundWalletList key={wallet.name} wallet={wallet} />
          }
        })}
      </List.Control>
    </List>
  )
}
