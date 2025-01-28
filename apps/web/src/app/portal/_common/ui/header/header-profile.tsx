'use client'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
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
    <Popover>
      <PopoverTrigger>
        <Button asChild variant="secondary">
          {session.user.email.email}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] space-y-3">
        <div>Dunno something</div>
        <Separator />
        <div className="flex w-full justify-end">
          <Button variant="secondary" size="sm" onClick={logoutAction}>
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
