'use client'

import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { classNames } from '@sushiswap/ui13'
import { JazzIcon } from '@sushiswap/ui13/components/icons/JazzIcon'
import { useBreakpoint } from '@sushiswap/ui13/lib/useBreakpoint'
import Image from 'next/legacy/image'
import React, { FC, useState } from 'react'
import ReactDOM from 'react-dom'
import { useAccount, useEnsAvatar, useNetwork } from 'wagmi'

import { ConnectButton } from '../ConnectButton'
import { DefaultView } from './DefaultView'
import { TransactionsView } from './TransactionsView'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  supportedNetworks: ChainId[]
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const UserProfile: FC<ProfileProps> = ({ notifications, clearNotifications, supportedNetworks }) => {
  const { isSm } = useBreakpoint('sm')
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { chain } = useNetwork()
  const { address } = useAccount()
  const chainId = chain?.id || ChainId.ETHEREUM

  const { data: avatar } = useEnsAvatar({
    address,
  })

  if (!address) {
    return (
      <ConnectButton
        size="sm"
        className="cursor-pointer flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-gray-700 dark:text-slate-200"
        supportedNetworks={supportedNetworks}
      />
    )
  }

  const panel = (
    <Popover.Panel className="w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-md shadow-black/[0.3] bg-slate-900 border border-slate-200/20">
      {view === ProfileView.Default && <DefaultView chainId={chainId} address={address} setView={setView} />}
      {view === ProfileView.Transactions && <TransactionsView setView={setView} address={address} />}
    </Popover.Panel>
  )

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-gray-700 dark:text-slate-200">
              <div className="hidden md:flex">
                {avatar ? (
                  <Image alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
                ) : (
                  <JazzIcon diameter={20} address={address} />
                )}
              </div>
              {shortenAddress(address, isSm ? 3 : 2)}{' '}
              <ChevronDownIcon
                width={20}
                height={20}
                className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
              />
            </Popover.Button>
            {!isSm ? ReactDOM.createPortal(panel, document.body) : panel}
          </>
        )
      }}
    </Popover>
  )
}
