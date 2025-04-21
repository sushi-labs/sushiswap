import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { getUserStyroClient } from '../../_common/lib/styro/styro-client'

export async function GET(request: NextRequest) {
  let client
  try {
    client = await getUserStyroClient()
  } catch {
    // Not logged in
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/portal`,
    )
  }

  const cookiez = await cookies()
  const lastTeamId = cookiez.get('portal-last-team-id')

  if (lastTeamId) {
    try {
      // Check if the user still has access to the last team
      const response = await client.getTeamsTeamId({
        teamId: lastTeamId.value,
      })

      return NextResponse.redirect(
        `${request.nextUrl.protocol}//${request.nextUrl.host}/portal/dashboard/${response.data.team.id}`,
      )
    } catch (e) {
      console.error(e)
      // Fall back to personal team
    }
  }

  try {
    const response = await client.getUsersMe()

    return NextResponse.redirect(
      `${request.nextUrl.protocol}/${request.nextUrl.host}/portal/dashboard/${response.data.user.personalTeam}`,
    )
  } catch (e) {
    console.error(e)
    throw new Error('Failed to get user data')
  }
}
