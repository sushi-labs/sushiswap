import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, search, searchParams } = req.nextUrl

  // Index handling
  if (pathname === '/' && search !== '') {
    const url = req.nextUrl.clone()
    url.pathname = '/csr'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
