import {
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  InboxArrowDownIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { ClipboardController } from '@sushiswap/ui13/components/ClipboardController'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import { JazzIcon } from '@sushiswap/ui13/components/icons/JazzIcon'
import { List } from '@sushiswap/ui13/components/list/List'
import { getOnrampURL, OnRampProvider } from '@sushiswap/ui13/lib/getOnrampURL'
import Image from 'next/legacy/image'
import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { useBalance, useDisconnect, useEnsAvatar } from 'wagmi'

import { usePrices } from '../../hooks'
import { ProfileView } from './index'
import { usePrice } from '@sushiswap/react-query'

interface DefaultProps {
  chainId: ChainId
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const DefaultView: FC<DefaultProps> = ({ chainId, address, setView }) => {
  const { disconnect } = useDisconnect()
  const { data: price } = usePrice({ chainId, address: Native.onChain(chainId).wrapped.address })
  const { data: avatar } = useEnsAvatar({
    chainId: ChainId.ETHEREUM,
    address,
  })

  const { data: _balance } = useBalance({
    address: address,
    chainId,
  })

  const balance = useMemo(
    () => Amount.fromRawAmount(Native.onChain(chainId), _balance ? _balance?.value.toString() : '0'),
    [_balance, chainId]
  )

  const balanceAsUsd = useMemo(() => {
    return balance && price ? balance.multiply(price) : undefined
  }, [balance, price])

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        <div className="flex justify-between gap-3">
          <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
            {avatar ? (
              <div className="w-4 h-4">
                <Image alt="ens-avatar" src={avatar} width={16} height={16} className="rounded-full" />
              </div>
            ) : (
              <JazzIcon diameter={16} address={address} />
            )}
            <ClipboardController>
              {({ setCopied }) => (
                <span className="cursor-pointer" onClick={() => setCopied(address)}>
                  {shortenAddress(address)}
                </span>
              )}
            </ClipboardController>
          </div>
          <div className="flex gap-5">
            <IconButton
              as="a"
              target="_blank"
              icon={CreditCardIcon}
              iconProps={{ width: 18, height: 18 }}
              href={getOnrampURL(OnRampProvider.Transak, address)}
              description="Buy Crypto"
            />
            <ClipboardController hideTooltip>
              {({ setCopied, isCopied }) => (
                <IconButton
                  icon={DocumentDuplicateIcon}
                  iconProps={{ width: 18, height: 18 }}
                  onClick={() => setCopied(address)}
                  description={isCopied ? 'Copied!' : 'Copy Address'}
                />
              )}
            </ClipboardController>
            <IconButton
              icon={LinkIcon}
              iconProps={{ width: 18, height: 18 }}
              as="a"
              target="_blank"
              href={chains[chainId].getAccountUrl(address)}
              description="View on Explorer"
            />
            <IconButton
              icon={ArrowLeftOnRectangleIcon}
              iconProps={{ width: 18, height: 18 }}
              onClick={() => disconnect()}
              description="Disconnect Wallet"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-3xl font-medium whitespace-nowrap">
            {balance.toSignificant(3)} {Native.onChain(chainId).symbol}
          </p>
          <p className="font-medium text-slate-400">${balanceAsUsd?.toFixed(2)}</p>
        </div>
      </div>
      <List>
        <List.Control className="bg-gray-100 dark:!bg-slate-700">
          <List.MenuItem
            icon={InboxArrowDownIcon}
            title="Transactions"
            onClick={() => setView(ProfileView.Transactions)}
            hoverIcon={ChevronRightIcon}
            hoverIconProps={{ width: 20, height: 20 }}
          />
          <List.MenuItem
            icon={CreditCardIcon}
            target="_blank"
            as="a"
            href={getOnrampURL(OnRampProvider.Transak, address)}
            title="Buy Crypto"
            hoverIcon={LinkIcon}
            hoverIconProps={{ width: 20, height: 20, className: 'text-blue' }}
          />
        </List.Control>
      </List>
    </>
  )
}
