import {ChevronDoubleDownIcon} from '@heroicons/react/24/outline'
import {Button, ButtonProps} from '@sushiswap/ui/components/button'
import {
  CoinbaseWalletIcon,
  FrameIcon,
  GnosisSafeIcon,
  LedgerIcon,
  MetamaskIcon,
  RabbyIcon,
  TrustWalletIcon,
  WalletConnectIcon
} from '@sushiswap/ui/components/icons'
import React, {FC, useCallback, useMemo} from 'react'
import {useConnect} from '../../hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@sushiswap/ui/components/dropdown-menu";

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
}

export const ConnectButton: FC<ButtonProps> = ({ children, ...props }) => {
  const { connectors, connect, pendingConnector } = useConnect()

  const onSelect = useCallback(
    (connectorId: string) => {
      return connect({
        connector: connectors.find((el) => el.id === connectorId),
      })
    },
    [connect, connectors]
  )

  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find((el) => el.id === 'injected')

    if (injected) {
      return [injected, ...conns.filter((el) => el.id !== 'injected' && el.name !== injected.name)]
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
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {_connectors.map((connector) => {
              const Icon = Icons[connector.name]
              return (
                  <DropdownMenuItem
                      onClick={() => onSelect(connector.id)}
                      key={connector.id}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {                        connector.name == 'Safe'
                        ? 'Gnosis Safe'
                        : connector.name == 'WalletConnectLegacy'
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
