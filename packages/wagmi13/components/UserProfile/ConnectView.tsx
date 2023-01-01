import { ChevronDoubleDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui13/components/icons'
import { List } from '@sushiswap/ui13/components/list/List'
import React, { FC, SVGProps, useCallback } from 'react'
import { useConnect } from 'wagmi'

const Icons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  Injected: ChevronDoubleDownIcon,
  MetaMask: MetamaskIcon,
  'Trust Wallet': TrustWalletIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Safe: GnosisSafeIcon,
}

export const ConnectView: FC<{ onSelect(): void }> = ({ onSelect }) => {
  const { connectors, connect } = useConnect()

  const _onSelect = useCallback(
    (connectorId: string) => {
      onSelect()
      setTimeout(
        () =>
          connect({
            connector: connectors.find((el) => el.id === connectorId),
          }),
        250
      )
    },
    [connect, connectors, onSelect]
  )

  return (
    <List className="!p-0">
      {/* <List.Label>Wallet</List.Label> */}
      <List.Control className="bg-gray-100 dark:!bg-slate-700">
        {connectors.map((connector) => (
          <List.MenuItem
            onClick={() => _onSelect(connector.id)}
            icon={Icons[connector.name]}
            title={connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
            key={connector.id}
            hoverIcon={ChevronRightIcon}
          />
        ))}
      </List.Control>
    </List>
  )
}
