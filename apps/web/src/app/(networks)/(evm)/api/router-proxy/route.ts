import { checkBotId } from 'botid/server'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { signBotIdJwt, verifyBotIdJwt } from 'src/app/_common/botid/jwt'
import { isTest } from 'src/lib/environment'

export async function POST(request: NextRequest) {
  try {
    const cookiez = await cookies()
    const botIdJwt = cookiez.get('botid_jwt')

    let newJwt: string | undefined = undefined

    if (!botIdJwt || !verifyBotIdJwt(botIdJwt.value)) {
      if (!isTest) {
        const verification = await checkBotId({
          developmentOptions: {
            bypass: 'HUMAN',
          },
        })

        if (verification.isBot) {
          return NextResponse.json(
            { error: 'BotId check failed.' },
            { status: 403 },
          )
        }
      }

      newJwt = signBotIdJwt()
    }

    const body = await request.json()

    const url = new URL(body.url)
    if (!url.hostname.endsWith('.sushi.com')) {
      return NextResponse.json({ error: 'Invalid hostname.' }, { status: 400 })
    }

    const response = await fetch(body.url)

    if (newJwt) {
      response.headers.set(
        'Set-Cookie',
        `botid_jwt=${newJwt}; Path=/; HttpOnly; SameSite=Strict; Max-Age=300; Secure`,
      )
    }

    return response
  } catch (error) {
    console.error('Router proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
