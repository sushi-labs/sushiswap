import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['networks']

export const config = {
  matcher: '/earn',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const changed = false

  // url.searchParams.forEach((_, key) => {
  //   if (!allowedParams.includes(key)) {
  //     url.searchParams.delete(key)
  //     changed = true
  //   }
  // })

  // Avoid infinite loop by only redirecting if the query
  // params were changed
  if (changed) {
    return NextResponse.rewrite(url)
  }
}
