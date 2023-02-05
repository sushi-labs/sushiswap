import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Need CSR when filtering
  if (pathname === '/' && search !== '') {
    const url = req.nextUrl.clone()
    url.pathname = '/index-query'

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
