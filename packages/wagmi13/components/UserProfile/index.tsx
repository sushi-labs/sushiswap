'use client'

import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { classNames } from '@sushiswap/ui13'
import { Button } from '@sushiswap/ui13/components/button'
import { JazzIcon } from '@sushiswap/ui13/components/icons/JazzIcon'
import { useBreakpoint } from '@sushiswap/ui13/lib/useBreakpoint'
import Image from 'next/legacy/image'
import React, { FC, useState } from 'react'
import { useAccount, useEnsAvatar, useNetwork } from 'wagmi'

import { ConnectButton } from '../ConnectButton'
import { DefaultView } from './DefaultView'
import { TransactionsView } from './TransactionsView'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  networks: ChainId[]
}

export const UserProfile: FC<ProfileProps> = ({ networks }) => {
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
        supportedNetworks={networks}
      />
    )
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={Button} variant="outlined" color="default" size="md">
            <div className="hidden md:flex">
              {avatar ? (
                <Image alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
              ) : (
                <JazzIcon diameter={20} address={address} />
              )}
            </div>
            {shortenAddress(address, isSm ? 3 : 2)}{' '}
            <ChevronDownIcon
              width={24}
              height={24}
              className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
            />
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
          >
            <div className="absolute pt-2 -top-[-1] right-0 sm:w-[320px]">
              <Popover.Panel className="p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                {view === ProfileView.Default && <DefaultView chainId={chainId} address={address} setView={setView} />}
                {view === ProfileView.Transactions && <TransactionsView setView={setView} address={address} />}
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
