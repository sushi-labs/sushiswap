import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Popover, Transition } from '@headlessui/react'
import { JazzIcon, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ConnectView } from './ConnectView'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokens } from 'utils/useTokens'

interface Props {
  hideChevron?: boolean
  varient?: string
  color: string
  fullWidth?: boolean
  size: string
}

export enum ProfileView {
  Disconnected,
  Default,
  Transactions,
  Settings,
}

export default function WalletSelector({ hideChevron, varient, color, fullWidth, size }: Props) {
  const { account, connected } = useWallet()
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { data: tokens } = useTokens()
  const nativeCurr = tokens?.['0x1::aptos_coin::AptosCoin']
  const { data: balance } = useTokenBalance({
    account: account?.address as string,
    currency: nativeCurr?.address as string,
    refetchInterval: 2000,
  })
  return (
    <Popover className={fullWidth ? 'relative w-full' : ''}>
      {({ open, close }) => (
        <>
          <Popover.Button
            as={Button}
            fullWidth
            variant={varient && varient}
            color={color}
            size={size}
            className="!font-medium"
          >
            {account?.address ? (
              <>
                <div className="hidden md:flex">
                  <JazzIcon diameter={20} address={account?.address} />
                </div>
                {`${account?.address?.substring(0, 5)}...${account?.address?.substring(66 - 3)}`}
                {!hideChevron && (
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
                  />
                )}
              </>
            ) : (
              <>
                <span className="hidden md:block">Connect Wallet</span>
                <span className="block md:hidden">Connect</span>
                {!hideChevron && (
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
                  />
                )}
              </>
            )}
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-[0.95]"
            enterTo="transform scale-[1] z-10 relative"
            leave="transition duration-200 ease-out"
            leaveFrom="transform scale-[1] opacity-1"
            leaveTo="transform scale-[0.95] opacity-0"
          >
            <div
              className={classNames(
                fullWidth ? 'w-full -top-[-1px]' : 'sm:w-[340px] -top-[-4px]',
                'z-[1] absolute pt-2 right-0'
              )}
            >
              <Popover.Panel
                className={`${
                  fullWidth ? 'p-2 dark:bg-slate-800' : 'p-1 dark:bg-slate-800/50'
                } flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white/50 paper`}
              >
                {!connected && <ConnectView close={close} />}
                {connected && view == ProfileView.Default && (
                  <DefaultView balance={balance && balance / 10 ** 8} setView={setView} />
                )}
                {view == ProfileView.Settings && <SettingsView setView={setView} />}
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
