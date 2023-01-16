import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useBreakpoint } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, JazzIcon } from '@sushiswap/ui'
import Image from 'next/legacy/image'
import { FC, useState } from 'react'
import ReactDOM from 'react-dom'
import { useAccount, useEnsAvatar, useNetwork } from 'wagmi'

import { Wallet } from '../Wallet'
import { Default } from './Default'
import { Transactions } from './Transactions'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  supportedNetworks: ChainId[]
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const Profile: FC<ProfileProps> = ({ notifications, clearNotifications, supportedNetworks }) => {
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
      <Wallet.Button
        size="sm"
        className="border-none shadow-md whitespace-nowrap"
        supportedNetworks={supportedNetworks}
      />
    )
  }

  if (address) {
    const panel = (
      <Popover.Panel className="w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-md shadow-black/[0.3] bg-slate-900 border border-slate-200/20">
        {view === ProfileView.Default && <Default chainId={chainId} address={address} setView={setView} />}
        {view === ProfileView.Transactions && (
          <Transactions setView={setView} notifications={notifications} clearNotifications={clearNotifications} />
        )}
      </Popover.Panel>
    )

    return (
      <Popover className="relative">
        {({ open }) => {
          return (
            <>
              <Popover.Button
                className={classNames(
                  DEFAULT_INPUT_UNSTYLED,
                  'flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-slate-200'
                )}
              >
                {avatar ? (
                  <Image alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
                ) : (
                  <JazzIcon diameter={20} address={address} />
                )}
                {shortenAddress(address)}{' '}
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

  return <span />
}
