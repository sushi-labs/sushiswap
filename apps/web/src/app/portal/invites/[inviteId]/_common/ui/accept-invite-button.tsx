'use client'

import type { ResponseError } from '@sushiswap/styro-client'
import { Button, Collapsible, Dots, classNames } from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'

interface AcceptInviteButton {
  inviteId: string
}

export function AcceptInviteButton({ inviteId }: AcceptInviteButton) {
  const client = useStyroClient(true)
  const router = useRouter()

  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['portal-', inviteId],
    mutationFn: async () => {
      const response = await client.postInvitesInviteIdAccept({
        inviteId,
      })

      return response.data
    },
    onSuccess: (data) => {
      router.push(`/portal/dashboard/${data.team.id}`)
    },
    onError: async (e: ResponseError) => {
      setGlobalErrorMsg(await parseStyroError(e))
    },
  })

  return (
    <div className="w-full">
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        onClick={() => mutateAsync()}
      >
        {!isPending ? (
          'Accept'
        ) : (
          <span>
            Accepting
            <Dots />
          </span>
        )}
      </Button>
      <Collapsible open={!!globalErrorMsg}>
        <div
          className={classNames(
            globalErrorMsg && 'text-red-500',
            'w-full text-center font-medium pt-4',
          )}
        >
          {globalErrorMsg || ''}
        </div>
      </Collapsible>
    </div>
  )
}
