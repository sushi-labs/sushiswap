import { cookies } from 'next/headers'
import { type ReactElement, Suspense } from 'react'
import { CookieDialog } from './cookie-dialog'

export function CookieDialogContainer({
  children,
}: { children: ReactElement }) {
  return (
    <Suspense>
      <_CookieDialogContainer>{children}</_CookieDialogContainer>
    </Suspense>
  )
}

async function _CookieDialogContainer({
  children,
}: { children: ReactElement }) {
  const cookiez = await cookies()
  const cookiesConfirmed = cookiez.has('accepted-cookies')

  return <CookieDialog defaultOpen={!cookiesConfirmed}>{children}</CookieDialog>
}
