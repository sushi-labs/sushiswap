import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { CookieDialog } from './cookie-dialog'

export function CookieDialogContainer() {
  return (
    <Suspense>
      <_CookieDialogContainer />
    </Suspense>
  )
}

function _CookieDialogContainer() {
  const cookiez = cookies()
  const cookiesConfirmed = cookiez.has('accepted-cookies')

  if (cookiesConfirmed) {
    return null
  }

  return <CookieDialog open={true} />
}
