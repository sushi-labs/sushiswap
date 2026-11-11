'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Button, PopoverPrimitive, cloudinaryFetchLoader } from '@sushiswap/ui'
import { WalletIcon } from '@sushiswap/ui/icons/wallet-icon'
import Image from 'next/image'
import { useMemo } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { type WalletNamespace, useWalletConnection } from 'src/lib/wallet'
import { useWallets } from 'src/lib/wallet/hooks/use-wallets'
import { type ChainId, shortenAddress } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useConnection, useEnsAvatar, useEnsName } from 'wagmi'
import { SidebarTrigger } from '../sidebar/sidebar-trigger'
import { getUserPortfolioWallet } from './get-user-portfolio-wallet'

interface UserPortfolioProps {
  selectedNetwork: ChainId | undefined
  namespace?: WalletNamespace
  isPerps?: boolean
}

export function UserPortfolio({
  selectedNetwork,
  namespace,
  isPerps,
}: UserPortfolioProps) {
  const wallets = useWallets()
  const isMounted = useIsMounted()
  const { isRestoring } = useWalletConnection()

  const wallet = getUserPortfolioWallet(wallets, selectedNetwork)

  const { address: wagmiAddress } = useConnection()

  const address = wallet?.account ?? wagmiAddress

  const { isOpen, open, close } = useSidebar()

  const { data: ensName } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: wagmiAddress,
  })

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: EvmChainId.ETHEREUM,
  })

  const walletCount = useMemo(() => {
    if (!wallets) return 0
    return Object.values(wallets)?.filter((wallet) => wallet !== undefined)
      .length
  }, [wallets])

  return (
    <PopoverPrimitive.Anchor asChild>
      <div className="inline-flex">
        {!address || !isMounted ? (
          <ConnectButton
            variant={isPerps ? 'perps-default' : 'default'}
            namespace={namespace}
            loading={isRestoring}
          />
        ) : (
          <SidebarTrigger>
            <Button
              variant={isPerps ? 'perps-secondary' : 'secondary'}
              onClick={() => (isOpen ? close() : open())}
              className="items-center"
            >
              {avatar ? (
                <Image
                  alt="ens-avatar"
                  src={avatar}
                  width={16}
                  height={16}
                  className="rounded-full"
                  loader={cloudinaryFetchLoader}
                />
              ) : (
                <WalletIcon width={16} height={16} />
              )}
              <span className="hidden lg:block">{shortenAddress(address)}</span>
              {walletCount > 1 ? (
                <div className="w-4 h-4 rounded-full bg-pink text-white font-medium text-[8px] flex items-center justify-center">
                  +{walletCount - 1}
                </div>
              ) : null}
            </Button>
          </SidebarTrigger>
        )}
      </div>
    </PopoverPrimitive.Anchor>
  )
}
