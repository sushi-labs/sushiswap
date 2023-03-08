import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/1:NATIVE/1:SUSHI'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/')) return NextResponse.next()
}
