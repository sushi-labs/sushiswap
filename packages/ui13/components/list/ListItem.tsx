import { Transition } from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import React, { FC, Fragment, ReactNode, SVGProps, useState } from 'react'

export interface ListItemProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  onClick(): void
  hoverIcon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

export const ListItem: FC<ListItemProps> = ({ icon, subtitle, title, onClick, hoverIcon: HoverIcon }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="relative flex gap-3 px-4 py-3 hover:bg-black/[0.12] w-full items-center"
    >
      {icon}
      <div className="flex flex-col gap-0.5 items-start">
        <span className="text-sm font-medium dark:text-slate-200">{title}</span>
        {subtitle && <span className="text-[10px] text-slate-400">{subtitle}</span>}
      </div>
      <Transition
        as={Fragment}
        show={hover}
        enter="ease-in-out duration-300"
        enterFrom="translate-x-[10px] opacity-0"
        enterTo="translate-x-[-16px] opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-[-16px] opacity-100"
        leaveTo="translate-x-[10px] opacity-0"
        unmount={false}
      >
        <div className="absolute right-0 top-0 bottom-0 flex justify-center items-center">
          {HoverIcon ? (
            <HoverIcon width={20} height={20} className="text-red" />
          ) : (
            <ArrowLongRightIcon width={20} height={20} strokeWidth={5} className="text-blue" />
          )}
        </div>
      </Transition>
    </button>
  )
}
