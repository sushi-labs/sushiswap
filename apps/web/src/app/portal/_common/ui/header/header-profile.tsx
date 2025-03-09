'use client'

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { logoutAction } from 'src/app/portal/_common/lib/logout-action'
import { useSession } from '../auth-provider/auth-provider'

export function HeaderProfile() {
  const session = useSession()

  if (!session.isLoggedIn) {
    return (
      <div className="space-x-2">
        <Link href="/portal/login" prefetch={true}>
          <Button variant="secondary">Sign In</Button>
        </Link>
        <Link href="/portal/register" prefetch={true}>
          <Button variant="secondary">Register</Button>
        </Link>
      </div>
    )
  }

  return (
    <Button asChild variant="secondary" className="items-center flex">
      <span>{session.user.email.email}</span>
      <ArrowRightOnRectangleIcon
        width={18}
        height={18}
        onClick={() => logoutAction()}
      />
    </Button>
  )
}
