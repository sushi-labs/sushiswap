import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { getSessionData } from 'src/app/portal/_common/lib/client-config'

export default async function Page() {
  const session = await getSessionData()

  if (!session.isLoggedIn) {
    return <></>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Session</h1>
      <div className="space-y-6">
        <span>You are logged in as {session.user.email.email}.</span>
        <div>
          <Link href="/portal/dashboard">
            <Button fullWidth>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
