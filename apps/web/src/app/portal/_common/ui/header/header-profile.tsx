'use client'

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { useQueryClient } from '@tanstack/react-query'
import { useTopLoader } from 'nextjs-toploader'
import { useMemo } from 'react'
import { logoutAction } from 'src/app/portal/_common/lib/logout-action'
import { useSession } from '../auth-provider/auth-provider'

export function HeaderProfile() {
  const session = useSession()
  const client = useQueryClient()

  const loader = useTopLoader()

  const onClick = useMemo(() => {
    return () => {
      loader.start()
      client.clear()
      logoutAction()
    }
  }, [client, loader])

  if (!session.isLoggedIn) {
    return <></>
  }

  return (
    <div className="rounded-xl flex flex-row whitespace-nowrap items-center overflow-hidden bg-secondary">
      <span className="hidden pl-3 py-2 pr-2 text-sm bg-secondary bg-opacity-50 h-full sm:flex items-center">
        {session.user.email.email}
      </span>
      <div
        className="pr-3 py-2 h-full flex items-center pl-2 cursor-pointer hover:bg-muted focus:bg-accent"
        onClick={onClick}
        onKeyUp={onClick}
      >
        <ArrowRightOnRectangleIcon width={18} height={18} />
      </div>
    </div>
  )
}
