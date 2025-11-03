import { checkBotId } from 'botid/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const verification = await checkBotId({
    developmentOptions: {
      isDevelopment: process.env.NODE_ENV !== 'production',
    },
  })

  if (verification.isBot) {
    return NextResponse.json({ error: 'BotId check failed.' }, { status: 403 })
  }

  const body = await request.json()

  const response = await fetch(body.url)
  return response
}
