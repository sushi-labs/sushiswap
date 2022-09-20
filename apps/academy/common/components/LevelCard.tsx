import { Transition } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Chip, CircleIcon, Typography } from '@sushiswap/ui'
import { FC, Fragment, ReactNode, useState } from 'react'

interface LevelCard {
  name: string
  icon: ReactNode
  chipLabel: string
  title: string
  color: string
}

export const LevelCard: FC<LevelCard> = ({ icon, chipLabel, title, name, color }) => {
  const [hover, setHover] = useState(false)

  return (
    <a
      href={`/academy/articles?level=${name}`}
      className="flex-1 h-[405px] min-w-[306px] md:h-[460px] py-[50px] px-[30px] bg-slate-800 rounded-[30px] flex flex-col justify-between hover:ring-1 ring-slate-600 transition duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-[130px] h-[130px]">{icon}</div>
      <div className="space-y-5">
        <div className="relative flex items-center h-10">
          <Chip
            label={chipLabel}
            color="default"
            className="h-[28px] text-sm font-normal"
            icon={<CircleIcon width={8} height={8} fill={color} stroke={color} />}
          />
          <Transition
            as={Fragment}
            show={hover}
            enter="ease-in-out duration-300"
            enterFrom="translate-x-[20px] opacity-0"
            enterTo="translate-x-[0px] opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="translate-x-[0px] opacity-100"
            leaveTo="translate-x-[20px] opacity-0"
            unmount={false}
          >
            <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center">
              <div className="bg-[#3B7EF6] rounded-full p-3">
                <ArrowRightIcon className="w-4 h-4 " />
              </div>
            </div>
          </Transition>
        </div>
        <Typography variant="h3" weight={700}>
          {title}
        </Typography>
      </div>
    </a>
  )
}
