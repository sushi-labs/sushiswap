'use client'

import { Tabs, TabsList, TabsTrigger } from '@sushiswap/ui'
import { usePathname, useRouter } from 'next/navigation'

function getTab(pathname: string) {
  if (pathname.endsWith('/settings')) {
    return 'account'
  }

  if (pathname.endsWith('/settings/team')) {
    return 'team'
  }

  if (pathname.endsWith('/settings/billing')) {
    return 'billing'
  }

  throw new Error('Invalid pathname')
}

export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="space-y-4">
      <Tabs
        value={getTab(pathname)}
        onValueChange={async (_value) => {
          const value = _value === 'account' ? '' : `/${_value}`

          const { teamId } = await params
          router.push(`/portal/dashboard/${teamId}/settings${value}`)
        }}
      >
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  )
}
