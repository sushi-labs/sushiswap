'use client'

import { CheckIcon } from '@heroicons/react-v1/solid'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useOnClickOutside } from '@sushiswap/hooks'
import { Separator, classNames } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface TeamSwitcher {
  currentTeamId: string
}

const teams = ['1', '2', '3', '4', '5'].map((id) => ({
  id,
  name: `Team${id}`,
}))

export function TeamSwitcher({ currentTeamId }: TeamSwitcher) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  useOnClickOutside(ref, () => {
    setOpen(false)
  })

  const onTeamClick = (teamId: string) => {
    if (currentTeamId === teamId) return
    router.push(`/portal/dashboard/${teamId}`)
  }

  return (
    <div className="flex flex-col gap-3 relative">
      <div className="z-10 flex w-full gap-4">
        <div ref={ref} className="w-full">
          <div
            className={classNames(
              'px-6 py-3 space-x-4 w-full',
              'border border-accent bg-secondary',
              'cursor-pointer rounded-xl ',
              'font-medium flex flex-row justify-between items-center select-none',
            )}
            onClick={() => setOpen(!open)}
            onKeyUp={(e) => e.key === 'Enter' && setOpen(!open)}
          >
            <span>{currentTeamId}</span>
            <ChevronDownIcon
              width={20}
              height={20}
              className={classNames(open && 'rotate-180', 'duration-200')}
            />
          </div>
          <div
            className={classNames(
              open
                ? 'max-h-[800px] pt-4 pb-2 border-b border-l border-r overflow-y-hidden'
                : 'max-h-[0px]',
              'z-[100] rounded-b-xl flex flex-col gap-2 overflow-hidden transition-all duration-200 absolute w-full -mt-2.5 px-3',
              'dark:bg-[#21293a] dark:border-accent',
              // 'border-black border-opacity-30 bg-neutral-100',
            )}
          >
            {teams.map((team) => (
              <div
                key={team.id}
                className={classNames(
                  currentTeamId === team.id
                    ? 'cursor-default'
                    : 'cursor-pointer',
                  'px-4 py-3 w-full font-medium rounded-xl',
                  'flex flex-row justify-between items-center',
                  'hover:bg-accent dark:hover:bg-accent',
                )}
                onClick={() => onTeamClick(team.id)}
                onKeyUp={() => onTeamClick(team.id)}
              >
                {team.name}
                {team.id === currentTeamId && (
                  <CheckIcon
                    height={20}
                    width={20}
                    className="text-green-500"
                  />
                )}
              </div>
            ))}
            <Separator />
            <div className="px-4 py-2 flex flex-row justify-between w-full hover:bg-accent rounded-xl cursor-pointer">
              <span className="text-sm">Create team</span>
              <PlusIcon width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
