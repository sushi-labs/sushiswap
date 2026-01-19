'use client'

import { Button, cloudinaryFetchLoader } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import { PlusOneIcon } from '@sushiswap/ui/icons/PlusOneIcon'
import Image from 'next/image'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useWallets } from 'src/lib/wallet'
import { ChainId } from 'sushi'
import { EvmChainId, shortenEvmAddress } from 'sushi/evm'
import { useConnection, useEnsAvatar, useEnsName } from 'wagmi'

interface UserPortfolioProps {
  selectedNetwork: ChainId | undefined
}

export function UserPortfolio({ selectedNetwork }: UserPortfolioProps) {
  const wallets = useWallets()

  const wallet =
    selectedNetwork === ChainId.SOLANA
      ? (wallets.svm ?? wallets.evm)
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

  if (!address) return <ConnectButton variant="secondary" />

  return (
    <Button variant="secondary" onClick={() => open()} className="items-center">
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
      <span className="hidden sm:block">{shortenEvmAddress(address)}</span>
      {wallets.svm && wallets.evm ? (
        <PlusOneIcon className="w-4 text-blue" />
      ) : null}
    </Button>
  )
}
