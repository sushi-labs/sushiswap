'use client'

import { useEffect } from 'react'
import { updateTeamCookieAction } from '../lib/update-team-cookie-action'

export function TeamCookieUpdater({ teamId }: { teamId: string }) {
  useEffect(() => {
    updateTeamCookieAction(teamId)
  }, [teamId])

  return <></>
}
