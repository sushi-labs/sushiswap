import { Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import React, { Fragment, SVGProps, useState } from 'react'
import { Wallet } from '@aptos-labs/wallet-adapter-core'
interface Props {
  Icons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element | null>
  wallet: Wallet
}
export const NotFoundWalletList = ({ Icons, wallet }: Props) => {
  const [hover, setHover] = useState(false)
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      href={wallet.url}
      target="_blank"
      className="p-0 items-center hover:bg-black/[0.04] active:bg-black/[0.06] hover:dark:bg-white/[0.02] active:dark:bg-white/[0.03] relative flex gap-4 px-4 py-3 w-full cursor-pointer rounded-xl"
    >
      <span className="h-[18px] w-[18px]">
        {React.createElement(Icons[wallet.name], {
          width: 18,
          height: 18,
          strokeWidth: 2,
          className: 'text-blue-500',
        })}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-slate-200">{wallet.name}</span>

      <Transition
        as={Fragment}
        show={hover}
        enter="ease-in-out duration-300"
        enterFrom="translate-x-[10px] opacity-0"
        enterTo="translate-x-[-8px] opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-[-8px] opacity-100"
        leaveTo="translate-x-[10px] opacity-0"
        unmount={false}
      >
        <span className="absolute right-0 top-0 bottom-0 flex justify-center items-center">
          <ChevronRightIcon width={20} height={20} />
        </span>
      </Transition>
    </a>
  )
}
