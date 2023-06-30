import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Popover, Transition } from '@headlessui/react'
import { JazzIcon, classNames } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Button } from '@sushiswap/ui/future/components/button'
import { shortenAddress } from '@sushiswap/format'
import * as React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useConnect } from '@sushiswap/wagmi'
import { ConnectView } from './ConnectView'
import { DefaultView } from './DefaultView'

type fullWidth = {
  fullWidth: boolean
}
interface Props {
  children: React.ReactNode
  rest: {
    fullWidth: boolean
  }
}

export default function WalletSelector() {
  const { account, connected } = useWallet()
  return (
    <Popover>
      {({ open, close }) => (
        <>
          <Popover.Button as={Button} variant="outlined" color="default" size="md" className="!font-medium">
            {account?.address ? (
              <>
                <div className="hidden md:flex">
                  <JazzIcon diameter={20} address={account?.address} />
                </div>
                {`${account?.address.substring(0, 5)}...${account?.address.substring(66 - 3)}`}
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
                {!connected ? <ConnectView close={close} /> : <DefaultView />}
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
