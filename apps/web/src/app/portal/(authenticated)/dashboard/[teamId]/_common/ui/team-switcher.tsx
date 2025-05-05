'use client'

import { CheckIcon } from '@heroicons/react-v1/solid'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useOnClickOutside } from '@sushiswap/hooks'
import type { StyroResults } from '@sushiswap/styro-client'
import { Separator, SkeletonText, classNames } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useRef, useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CreateTeamDialog } from './create-team-dialog'

function TeamSwitcherEntry(
  props:
    | { isLoading: true }
    | {
        active: boolean
        onClick: (id: string) => void
        team: { id: string; name: string }
      },
) {
  const baseClassNames = classNames(
    'px-4 py-3 w-full font-medium rounded-xl',
    'flex flex-row justify-between items-center',
    'hover:bg-accent',
  )

  if ('isLoading' in props) {
    return (
      <div className={baseClassNames}>
        <SkeletonText />
      </div>
    )
  }

  return (
    <div
      className={classNames(
        props.active ? 'cursor-default' : 'cursor-pointer',
        baseClassNames,
      )}
      onClick={() => props.onClick(props.team.id)}
      onKeyUp={() => props.onClick(props.team.id)}
    >
      {props.team.name}
      {props.active && (
        <CheckIcon height={20} width={20} className="text-green-500" />
      )}
    </div>
  )
}

interface TeamSwitcher {
  currentTeam: StyroResults['getTeamsTeamId']['data']['team']
}

export function TeamSwitcher({ currentTeam }: TeamSwitcher) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const client = useStyroClient(true)

  const pathname = usePathname()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['portal-getUsersMe'],
    queryFn: async () => {
      const response = await client.getUsersMe()

      return response
    },
    select: (response) => response.data.user,
  })

  useOnClickOutside(ref, () => {
    setOpen(false)
  })

  const onTeamClick = (teamId: string) => {
    if (currentTeam.id === teamId) return
    router.push(pathname.replace(currentTeam.id, teamId))
  }

  return (
    <div className="flex flex-col gap-3 relative">
      <div className="z-10 flex w-full gap-4">
        <div ref={ref} className="w-full">
          <div
            className={classNames(
              'px-5 py-3 space-x-3 w-full',
              'border border-accent bg-background',
              'cursor-pointer rounded-xl ',
              'font-medium flex flex-row justify-between items-center select-none',
            )}
            onClick={() => setOpen(!open)}
            onKeyUp={(e) => e.key === 'Enter' && setOpen(!open)}
          >
            <span className="text-sm whitespace-nowrap truncate">
              {currentTeam.name}
            </span>
            <ChevronDownIcon
              width={20}
              height={20}
              className={classNames(
                open && 'rotate-180',
                'duration-200 flex-shrink-0',
              )}
            />
          </div>
          <div
            className={classNames(
              open
                ? 'max-h-[800px] pt-4 pb-2 border-b border-l border-r overflow-y-hidden'
                : 'max-h-[0px]',
              'z-[100] rounded-b-xl flex flex-col gap-2 overflow-hidden transition-all duration-200 absolute w-full -mt-2.5 px-1 text-sm',
              'bg-background border-accent',
            )}
          >
            {isLoading && (
              <>
                <TeamSwitcherEntry key={1} isLoading />
                <TeamSwitcherEntry key={2} isLoading />
                <TeamSwitcherEntry key={3} isLoading />
              </>
            )}
            {isError && (
              <span className="text-sm text-center">Error loading teams</span>
            )}
            {data?.teams.map((team) => (
              <TeamSwitcherEntry
                key={team.id}
                active={currentTeam.id === team.id}
                onClick={onTeamClick}
                team={team}
              />
            ))}
            <Separator />
            <CreateTeamDialog>
              <div className="px-4 py-2 flex flex-row justify-between w-full hover:bg-accent rounded-xl cursor-pointer">
                <span className="text-sm">Create team</span>
                <PlusIcon width={20} height={20} />
              </div>
            </CreateTeamDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
