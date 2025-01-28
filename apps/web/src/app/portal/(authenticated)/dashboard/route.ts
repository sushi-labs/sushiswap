import { NextRequest, NextResponse } from 'next/server'
import { getSessionData } from '../../_common/lib/client-config'

export async function GET(request: NextRequest) {
  const session = await getSessionData()

  // TODO: Implement this logic
  const defaultTeamId = '1'

  return NextResponse.redirect(
    `${request.nextUrl.protocol}/${request.nextUrl.host}/portal/dashboard/${defaultTeamId}`,
  )
}
