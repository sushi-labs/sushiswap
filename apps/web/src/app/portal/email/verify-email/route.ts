import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { Template } from './template'

const schema = z.object({
  code: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const params = schema.parse(Object.fromEntries(searchParams))

  const renderToString = await import('react-dom/server').then(
    (i) => i.renderToString,
  )

  const headers = req.headers
  const host = headers.get('host')
  const protocol = headers.get('x-forwarded-proto') || 'https'

  const baseUrl = `${protocol}://${host}`

  return new Response(renderToString(Template({ baseUrl, code: params.code })))
}
