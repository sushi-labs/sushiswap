import { type NextRequest, NextResponse } from 'next/server'
import { getUserStyroClient } from '../../_common/lib/styro/styro-client'

export async function GET(request: NextRequest) {
  try {
    const client = await getUserStyroClient()
    const response = await client.getUsersMe()

    return NextResponse.redirect(
      `${request.nextUrl.protocol}/${request.nextUrl.host}/portal/dashboard/${response.data.user.personalTeam}`,
    )
  } catch {
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/portal/login`,
    )
  }
}
