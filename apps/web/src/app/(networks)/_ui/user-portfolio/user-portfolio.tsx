'use client'

import { Button, cloudinaryFetchLoader } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Image from 'next/image'
import { useMemo } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { type WalletNamespace, useWallets } from 'src/lib/wallet'
import { ChainId, shortenAddress } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useConnection, useEnsAvatar, useEnsName } from 'wagmi'
import { SidebarTrigger } from '../sidebar/sidebar-trigger'

interface UserPortfolioProps {
  selectedNetwork: ChainId | undefined
  namespace?: WalletNamespace
}

export function UserPortfolio({
  selectedNetwork,
  namespace,
}: UserPortfolioProps) {
  const wallets = useWallets()

  const wallet =
    selectedNetwork === ChainId.SOLANA
      ? (wallets.svm ?? wallets.evm)
      : selectedNetwork === ChainId.STELLAR
        ? wallets.stellar
        : (wallets.evm ?? wallets.svm)

  const { address: wagmiAddress } = useConnection()

  const address = wallet?.account ?? wagmiAddress

  const { open } = useSidebar()

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

  if (!address)
    return <ConnectButton variant="secondary" namespace={namespace} />

  return (
    <SidebarTrigger>
      <Button
        variant="secondary"
        onClick={() => open()}
        className="items-center"
      >
        {avatar ? (
          <Image
            alt="ens-avatar"
            src={avatar}
            width={20}
            height={20}
            className="rounded-full"
            loader={cloudinaryFetchLoader}
          />
        ) : (
          <JazzIcon diameter={20} address={address} />
        )}
        <span className="hidden sm:block">{shortenAddress(address)}</span>
        {walletCount > 1 ? (
          <div className="w-4 h-4 rounded-full bg-blue text-white font-medium text-[10px] flex items-center justify-center">
            +{walletCount - 1}
          </div>
        ) : null}
      </Button>
    </SidebarTrigger>
  )
}
