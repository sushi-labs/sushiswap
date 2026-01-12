'use client'

import { Button, cloudinaryFetchLoader } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
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

  const wallet = selectedNetwork === ChainId.SOLANA ? wallets.svm : wallets.evm

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
        <svg
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="15.5" height="15" rx="7.5" fill="#3B82F6" />
          <path
            d="M5.5 8.5H4.5C4.35834 8.5 4.23967 8.452 4.144 8.356C4.04834 8.26 4.00034 8.14133 4 8C3.99967 7.85867 4.04767 7.74 4.144 7.644C4.24034 7.548 4.359 7.5 4.5 7.5H5.5V6.5C5.5 6.35833 5.548 6.23967 5.644 6.144C5.74 6.04833 5.85867 6.00033 6 6C6.14134 5.99967 6.26017 6.04767 6.3565 6.144C6.45283 6.24033 6.50067 6.359 6.5 6.5V7.5H7.5C7.64167 7.5 7.7605 7.548 7.8565 7.644C7.9525 7.74 8.00034 7.85867 8 8C7.99967 8.14133 7.95167 8.26017 7.856 8.3565C7.76033 8.45283 7.64167 8.50067 7.5 8.5H6.5V9.5C6.5 9.64167 6.452 9.7605 6.356 9.8565C6.26 9.9525 6.14134 10.0003 6 10C5.85867 9.99967 5.74 9.95167 5.644 9.856C5.548 9.76033 5.5 9.64167 5.5 9.5V8.5ZM10.375 5.525L9.6625 6.0375C9.54584 6.12917 9.4145 6.1605 9.2685 6.1315C9.1225 6.1025 9.008 6.02533 8.925 5.9C8.85 5.78333 8.825 5.65617 8.85 5.5185C8.875 5.38083 8.94584 5.2705 9.0625 5.1875L10.6 4.075C10.6333 4.05 10.6688 4.03133 10.7065 4.019C10.7442 4.00667 10.7837 4.00033 10.825 4H11.1C11.2167 4 11.3125 4.0375 11.3875 4.1125C11.4625 4.1875 11.5 4.28333 11.5 4.4V10.4375C11.5 10.5958 11.4458 10.7292 11.3375 10.8375C11.2292 10.9458 11.0958 11 10.9375 11C10.7792 11 10.6458 10.9458 10.5375 10.8375C10.4292 10.7292 10.375 10.5958 10.375 10.4375V5.525Z"
            fill="white"
          />
        </svg>
      ) : null}
    </Button>
  )
}
