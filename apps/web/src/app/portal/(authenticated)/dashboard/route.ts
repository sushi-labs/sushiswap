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
