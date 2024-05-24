import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { List } from '@sushiswap/ui'
import React, { FC, SVGProps } from 'react'
import { FewchaIcon } from 'ui/common/icons/FewchaIcon'
import { MSafeIcon } from 'ui/common/icons/MSafeIcon'
import { MartianIcon } from 'ui/common/icons/MartianIcon'
import { PetraIcon } from 'ui/common/icons/PetraIcon'
import { PontemIcon } from 'ui/common/icons/PontemIcon'
import { RiseIcon } from 'ui/common/icons/RiseIcon'
import { NotFoundWalletList } from './not-found-wallet-list'

export const WalletIcons: Record<
  string,
  (props: SVGProps<SVGSVGElement>) => JSX.Element | null
> = {
  Petra: PetraIcon,
  Pontem: PontemIcon,
  Fewcha: FewchaIcon,
  Martian: MartianIcon,
  Rise: RiseIcon,
  MSafe: MSafeIcon,
}

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
                icon={WalletIcons[wallet.name]}
                key={wallet.name}
                hoverIcon={ChevronRightIcon}
              />
            )
          } else {
            return (
              <NotFoundWalletList
                key={wallet.name}
                Icons={WalletIcons}
                wallet={wallet}
              />
            )
          }
        })}
      </List.Control>
    </List>
  )
}
