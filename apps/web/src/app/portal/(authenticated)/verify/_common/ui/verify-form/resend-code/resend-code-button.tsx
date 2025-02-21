'use client'

import { Button, Loader } from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/icons/FailedMarkIcon'
import { useMutation } from '@tanstack/react-query'
import { resendCodeAction } from './resend-code-action'

export function ResendCodeButton() {
  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationKey: ['resend-code'],
    mutationFn: async () => {
      await resendCodeAction()
    },
  })

  return (
    <Button
      onClick={() => mutate()}
      fullWidth
      type="button"
      variant="secondary"
      disabled={isPending || isSuccess}
      className="space-x-1 flex items-center"
    >
      <span>Resend Code</span>
      {isPending && <Loader />}
      {isSuccess && <CheckMarkIcon width={16} />}
      {error && <FailedMarkIcon width={16} />}
    </Button>
  )
}
