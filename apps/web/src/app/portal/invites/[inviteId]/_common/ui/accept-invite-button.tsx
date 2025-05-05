'use client'

import type { ResponseError } from '@sushiswap/styro-client'
import { Button, Dots } from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'

interface AcceptInviteButton {
  inviteId: string
}

export function AcceptInviteButton({ inviteId }: AcceptInviteButton) {
  const client = useStyroClient(true)
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['portal-postInvitesInviteIdAccept', inviteId],
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
      setMessage({ type: 'error', message: await parseStyroError(e) })
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
      <CollapsibleMessage message={message} />
    </div>
  )
}
