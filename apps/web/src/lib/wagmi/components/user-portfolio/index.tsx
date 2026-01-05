'use client'

import { Button, cloudinaryFetchLoader } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Image from 'next/image'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { EvmChainId, shortenEvmAddress } from 'sushi/evm'
import { useConnection, useEnsAvatar, useEnsName } from 'wagmi'
import { ConnectButton } from '../connect-button'

export enum PortfolioView {
  Default = 'Default',
  Settings = 'Settings',
}

export const UserPortfolio = () => {
  const { address } = useConnection()
  const { open } = useSidebar()

  const { data: ensName } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address,
  })

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: EvmChainId.ETHEREUM,
  })

  if (!address) return <ConnectButton variant="secondary" />

  return (
    <Button variant="secondary" onClick={() => open()}>
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
    </Button>
  )
}
