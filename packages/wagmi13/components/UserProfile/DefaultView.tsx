'use client'

import {
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { ClipboardController } from '@sushiswap/ui13/components/ClipboardController'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import { JazzIcon } from '@sushiswap/ui13/components/icons/JazzIcon'
import { getOnrampURL, OnRampProvider } from '@sushiswap/ui13/lib/getOnrampURL'
import Image from 'next/legacy/image'
import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { useBalance, useDisconnect, useEnsAvatar } from 'wagmi'

import { usePrices } from '../../hooks'
import { ProfileView } from './index'

interface DefaultProps {
  chainId: ChainId
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const DefaultView: FC<DefaultProps> = ({ chainId, address, setView }) => {
  const { data: prices } = usePrices({ chainId })
  const { data: avatar } = useEnsAvatar({
    address: address,
  })

  const { data: _balance } = useBalance({
    address: address,
    chainId,
  })

  const balance = useMemo(
    () => Amount.fromRawAmount(Native.onChain(chainId), _balance ? _balance?.value.toString() : '0'),
    [_balance, chainId]
  )

  const { disconnect } = useDisconnect()

  const balanceAsUsd = useMemo(() => {
    return balance && prices?.[Native.onChain(chainId).wrapped.address]
      ? balance.multiply(prices?.[Native.onChain(chainId).wrapped.address])
      : undefined
  }, [balance, chainId, prices])

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        <div className="flex justify-between gap-3">
          <p className="text-sm font-semibold flex items-center gap-1.5 text-slate-50">
            {avatar ? (
              <div className="w-4 h-4">
                <Image alt="ens-avatar" src={avatar} width={16} height={16} className="rounded-full" />
              </div>
            ) : (
              <JazzIcon diameter={16} address={address} />
            )}
            {shortenAddress(address)}
          </p>
          <div className="flex gap-3">
            <IconButton
              as="a"
              target="_blank"
              href={getOnrampURL(OnRampProvider.Transak, address)}
              className="p-0.5"
              description="Buy Crypto"
            >
              <CreditCardIcon width={18} height={18} />
            </IconButton>
            <ClipboardController>
              {({ isCopied, setCopied }) => (
                <IconButton
                  onClick={() => setCopied(address)}
                  className="p-0.5"
                  description={isCopied ? 'Copied!' : 'Copy'}
                >
                  <DocumentDuplicateIcon width={18} height={18} />
                </IconButton>
              )}
            </ClipboardController>
            <IconButton
              as="a"
              target="_blank"
              href={chains[chainId].getAccountUrl(address)}
              className="p-0.5"
              description="Explore"
            >
              <LinkIcon width={18} height={18} />
            </IconButton>
            <IconButton as="button" onClick={() => disconnect()} className="p-0.5" description="Disconnect">
              <ArrowLeftOnRectangleIcon width={18} height={18} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-3xl font-medium whitespace-nowrap">
            {balance.toSignificant(3)} {Native.onChain(chainId).symbol}
          </p>
          <p className="font-medium text-slate-400">${balanceAsUsd?.toFixed(2)}</p>
        </div>
      </div>
      <div className="px-2">
        <div className="h-px bg-slate-200/10 w-full mt-3" />
      </div>
      <div className="p-2">
        <button
          onClick={() => setView(ProfileView.Transactions)}
          className="flex text-sm font-semibold hover:text-slate-50 w-full text-slate-400 justify-between items-center hover:bg-white/[0.04] rounded-xl p-2 pr-1 py-2.5"
        >
          Transactions <ChevronRightIcon width={20} height={20} />
        </button>
      </div>
    </>
  )
}
