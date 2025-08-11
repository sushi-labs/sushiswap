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

async function _CookieDialogContainer() {
  const cookiez = await cookies()
  const cookiesConfirmed = cookiez.has('accepted-cookies')

  return <CookieDialog defaultOpen={cookiesConfirmed} />
}
