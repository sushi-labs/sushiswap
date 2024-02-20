import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui/components/dropdown-menu'
import {
  CoinbaseWalletIcon,
  FrameIcon,
  GnosisSafeIcon,
  LedgerIcon,
  MetamaskIcon,
  RabbyIcon,
  TrustWalletIcon,
  WalletConnectIcon,
  XDEFIWalletIcon,
} from '@sushiswap/ui/components/icons'
import React, { FC, useCallback, useMemo } from 'react'

import { useConnect } from '../hooks'

const Icons: Record<string, React.ElementType> = {
  Injected: ChevronDoubleDownIcon,
  MetaMask: MetamaskIcon,
  'Trust Wallet': TrustWalletIcon,
  WalletConnect: WalletConnectIcon,
  WalletConnectLegacy: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Safe: GnosisSafeIcon,
  Rabby: RabbyIcon,
  Frame: FrameIcon,
  Ledger: LedgerIcon,
  'XDEFI Wallet': XDEFIWalletIcon,
}

export const ConnectButton: FC<ButtonProps> = ({
  children: _children,
  ...props
}) => {
  const { connectors, connect, pendingConnector } = useConnect()

  const onSelect = useCallback(
    (connectorId: string) => {
      return connect({
        connector: connectors.find((el) => el.id === connectorId),
      })
    },
    [connect, connectors],
  )

  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find((el) => el.id === 'injected')

    if (injected) {
      return [
        injected,
        ...conns.filter(
          (el) => el.id !== 'injected' && el.name !== injected.name,
        ),
      ]
    }

    return conns
  }, [connectors])

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pendingConnector) {
    return (
      <Button loading {...props}>
        Authorize Wallet
      </Button>
    )
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
          {_connectors.map((connector) => {
            const Icon =
              connector.name in Icons ? Icons[connector.name] : Icons.Injected
            return (
              <DropdownMenuItem
                onClick={() => onSelect(connector.id)}
                key={connector.id}
              >
                <Icon className="w-4 h-4 mr-2" />
                {connector.name === 'Safe'
                  ? 'Gnosis Safe'
                  : connector.name === 'WalletConnectLegacy'
                    ? 'WalletConnect'
                    : connector.name}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
