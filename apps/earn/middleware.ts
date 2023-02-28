import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Index handling

  if (pathname === '/') {
    if (search !== '') {
      // CSR when search params are present
      const url = req.nextUrl.clone()
      url.pathname = '/csr'
      return NextResponse.rewrite(url)
    } else {
      // SSG when no search params are present
      const url = req.nextUrl.clone()
      url.pathname = '/ssg'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
