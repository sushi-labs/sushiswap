import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, search, searchParams } = req.nextUrl

  // console.log({ pathname, search, searchParams })
  // Index handling
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/137:MATIC/137:SUSHI'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/')) return NextResponse.next()
}
