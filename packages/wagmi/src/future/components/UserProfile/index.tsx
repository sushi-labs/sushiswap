import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { JazzIcon } from '@sushiswap/ui/future/components/icons/JazzIcon'
import { useBreakpoint } from '@sushiswap/ui/future/lib/useBreakpoint'
import React, { FC, useState } from 'react'
import { useAccount, useEnsAvatar, useNetwork } from 'wagmi'

import { ConnectView } from './ConnectView'
import { DefaultView } from './DefaultView'
import { TransactionsView } from './TransactionsView'
import { SettingsView } from './SettingsView'

export enum ProfileView {
  Disconnected,
  Default,
  Transactions,
  Settings,
}

interface ProfileProps {
  networks: ChainId[]
}

export const UserProfile: FC<ProfileProps> = () => {
  const { isSm } = useBreakpoint('sm')
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: avatar } = useEnsAvatar({
    address,
    chainId: ChainId.ETHEREUM,
  })

  const chainId = (chain?.id as ChainId) || ChainId.ETHEREUM

  if (isSm)
    return (
      <Popover>
        {({ open, close }) => (
          <>
            <Popover.Button as={Button} variant="outlined" color="default" size="md" className="!font-medium">
              {address ? (
                <>
                  <div className="hidden md:flex">
                    {avatar ? (
                      <img alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
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
                </>
              ) : (
                <>
                  <span className="hidden md:block">Connect Wallet</span>
                  <span className="block md:hidden">Connect</span>
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
                  />
                </>
              )}
            </Popover.Button>
            <Transition
              show={open}
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-[0.95]"
              enterTo="transform scale-[1]"
              leave="transition duration-200 ease-out"
              leaveFrom="transform scale-[1] opacity-1"
              leaveTo="transform scale-[0.95] opacity-0"
            >
              <div className="absolute pt-2 -top-[-4px] right-0 sm:w-[340px]">
                <Popover.Panel className="p-1 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
                  {!address && <ConnectView onSelect={close} />}
                  {view === ProfileView.Default && address && (
                    <DefaultView chainId={chainId} address={address} setView={setView} />
                  )}
                  {view === ProfileView.Settings && <SettingsView setView={setView} />}
                  {view === ProfileView.Transactions && address && (
                    <TransactionsView setView={setView} address={address} />
                  )}
                </Popover.Panel>
              </div>
            </Transition>
          </>
        )}
      </Popover>
    )

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <Popover.Button as={Button} variant="outlined" color="default" size="md" className="!font-medium">
            {address ? (
              <>
                <div className="hidden md:flex">
                  {avatar ? (
                    <img alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
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
              </>
            ) : (
              <>
                <span className="hidden md:block">Connect Wallet</span>
                <span className="block md:hidden">Connect</span>
                <ChevronDownIcon
                  width={24}
                  height={24}
                  className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
                />
              </>
            )}
          </Popover.Button>
          <Dialog open={open} onClose={() => close()}>
            <Dialog.Content className="!bg-white dark:!bg-slate-800">
              <Popover.Panel>
                {!address && <ConnectView onSelect={close} />}
                {view === ProfileView.Default && address && (
                  <DefaultView chainId={chainId} address={address} setView={setView} />
                )}
                {view === ProfileView.Settings && <SettingsView setView={setView} />}
                {view === ProfileView.Transactions && address && (
                  <TransactionsView setView={setView} address={address} />
                )}
              </Popover.Panel>
            </Dialog.Content>
          </Dialog>
        </>
      )}
    </Popover>
  )
}
