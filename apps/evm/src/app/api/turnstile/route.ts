import { NextResponse } from 'next/server'
import { z } from 'zod'

const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const schema = z.object({
  token: z.string(),
})

export async function POST(request: Request) {
  if (!process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY)
    return NextResponse.json('CLOUDFLARE_TURNSTILE_SECRET_KEY undefined', {
      status: 500,
    })

  const result = schema.safeParse(await request.json())

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const response = await fetch(url, {
    body: JSON.stringify({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
      response: result.data.token,
      remoteip: request.headers.get('x-forwarded-for'),
    }),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await response.json()

  if (json.success) {
    return NextResponse.json({}, { status: 200 })
  } else {
    return NextResponse.json(
      { 'error-codes': json['error-codes'] },
      {
        status: 500,
      },
    )
  }
}
