'use server'

import { cookies } from 'next/headers'

export async function updateTeamCookieAction(teamId: string) {
  const cookiez = await cookies()

  cookiez.set('portal-last-team-id', teamId, {
    expires: 2147483647 * 1000,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/portal',
  })
}
