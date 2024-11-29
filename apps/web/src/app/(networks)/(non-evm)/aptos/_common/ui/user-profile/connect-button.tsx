import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react'
import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import React from 'react'

export function ConnectButton(props: ButtonProps) {
  const { wallets, connect } = useWallet()

  const onSelect = (name: WalletName) => {
    connect(name)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>
          <span className="hidden sm:block">Connect Wallet</span>
          <span className="block sm:hidden">Connect</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {wallets?.map((wallet) => {
            return (
              <DropdownMenuItem
                onClick={() => onSelect(wallet.name)}
                key={wallet.name}
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-4 h-4 mr-2"
                />
                {wallet.name}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
