'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { Card } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import {
  PENDING_PERPS_INVITE_KEY,
  type PendingPerpsInvite,
  createPendingPerpsInvite,
} from 'src/lib/perps/pending-invite'
import { normalizePerpsReferralCode } from 'src/lib/perps/referral-code'

export function InvitePage({ code }: { code: string }) {
  const router = useRouter()
  const [, setPendingInvite] = useLocalStorage<PendingPerpsInvite | undefined>(
    PENDING_PERPS_INVITE_KEY,
    undefined,
  )
  const newInviteRef = useRef<PendingPerpsInvite | null>(null)

  const newInvite = useMemo(() => {
    const normalizedCode = normalizePerpsReferralCode(code)
    return createPendingPerpsInvite(normalizedCode)
  }, [code])

  useEffect(() => {
    if (newInviteRef.current === newInvite) {
      return
    }

    newInviteRef.current = newInvite
    setPendingInvite(newInvite)
    router.replace('/perps')
  }, [newInvite, router, setPendingInvite])

  return (
    <Card className="flex min-h-[260px] items-center justify-center border-transparent !bg-[#18223B] p-4 !rounded-md text-center">
      <p className="text-sm text-slate-400">Redirecting to perps...</p>
    </Card>
  )
}
