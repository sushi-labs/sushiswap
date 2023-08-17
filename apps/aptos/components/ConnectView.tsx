import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { List } from '@sushiswap/ui/future/components/list/List'
import React, { FC, SVGProps } from 'react'
import { FewchaIcon } from 'walletIcons/FewchaIcon'
import { MartianIcon } from 'walletIcons/MartianIcon'
import { PetraIcon } from 'walletIcons/PetraIcon'
import { PontemIcon } from 'walletIcons/PontemIcon'
import { RiseIcon } from 'walletIcons/RiseIcon'
import { NotFoundWalletList } from './NotFoundWalletList'

const Icons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element | null> = {
  Petra: PetraIcon,
  Pontem: PontemIcon,
  Fewcha: FewchaIcon,
  Martian: MartianIcon,
  Rise: RiseIcon,
}

export const ConnectView: FC<{ close(): void }> = ({ close }) => {
  const { wallets, connect } = useWallet()
  const onSelect = (name: WalletName) => {
    connect(name)
    close()
  }
  return (
    <List className="!p-0 z-10">
      <List.Control className="bg-gray-100 dark:!bg-slate-700">
        {wallets.map((wallet, key) => {
          if (wallet.readyState == 'Installed') {
            return (
              <List.MenuItem
                className="p-0"
                onClick={() => onSelect(wallet.name as WalletName)}
                title={wallet.name}
                icon={Icons[wallet.name]}
                key={wallet.name}
                hoverIcon={ChevronRightIcon}
              ></List.MenuItem>
            )
          } else {
            return <NotFoundWalletList key={wallet.name} Icons={Icons} wallet={wallet} />
          }
        })}
      </List.Control>
    </List>
  )
}
