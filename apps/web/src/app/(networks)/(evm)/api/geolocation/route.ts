import { geolocation } from '@vercel/functions'

export function GET(request: Request): Response {
  const { country } = geolocation(request)

  return Response.json(
    { countryCode: country ?? null },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
