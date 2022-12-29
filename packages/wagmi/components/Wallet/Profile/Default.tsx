import { CreditCardIcon, DuplicateIcon, ExternalLinkIcon, LogoutIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { BuyCrypto, CopyHelper, IconButton, JazzIcon, Typography } from '@sushiswap/ui'
import Image from 'next/legacy/image'
import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { useBalance, useDisconnect, useEnsAvatar } from 'wagmi'

import { usePrices } from '../../../hooks'
import { ProfileView } from './Profile'

interface DefaultProps {
  chainId: ChainId
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const Default: FC<DefaultProps> = ({ chainId, address, setView }) => {
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
          <Typography variant="sm" weight={600} className="flex items-center gap-1.5 text-slate-50">
            {avatar ? (
              <div className="w-4 h-4">
                <Image alt="ens-avatar" src={avatar} width={16} height={16} className="rounded-full" />
              </div>
            ) : (
              <JazzIcon diameter={16} address={address} />
            )}
            {shortenAddress(address)}
          </Typography>
          <div className="flex gap-3">
            <BuyCrypto address={address}>
              {(buyUrl) => (
                <IconButton as="a" target="_blank" href={buyUrl} className="p-0.5" description="Buy Crypto">
                  <CreditCardIcon width={18} height={18} />
                </IconButton>
              )}
            </BuyCrypto>
            <CopyHelper toCopy={address} hideIcon>
              {(isCopied) => (
                <IconButton className="p-0.5" description={isCopied ? 'Copied!' : 'Copy'}>
                  <DuplicateIcon width={18} height={18} />
                </IconButton>
              )}
            </CopyHelper>
            <IconButton
              as="a"
              target="_blank"
              href={chains[chainId].getAccountUrl(address)}
              className="p-0.5"
              description="Explore"
            >
              <ExternalLinkIcon width={18} height={18} />
            </IconButton>
            <IconButton as="button" onClick={() => disconnect()} className="p-0.5" description="Disconnect">
              <LogoutIcon width={18} height={18} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Typography variant="h1" className="whitespace-nowrap">
            {balance.toSignificant(3)} {Native.onChain(chainId).symbol}
          </Typography>
          <Typography weight={600} className="text-slate-400">
            ${balanceAsUsd?.toFixed(2)}
          </Typography>
        </div>
      </div>
      <div className="px-2">
        <div className="w-full h-px mt-3 bg-slate-200/10" />
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
