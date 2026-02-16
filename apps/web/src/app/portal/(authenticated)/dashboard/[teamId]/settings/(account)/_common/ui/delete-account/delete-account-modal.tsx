'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  useForm,
} from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTopLoader } from 'nextjs-toploader'
import { type ReactNode, useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import { logoutAction } from 'src/app/portal/_common/lib/logout-action'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

interface DeleteAccountModal {
  children: ReactNode
}

const deleteAccountFormSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {}),
})

type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>

export function DeleteAccountModal({ children }: DeleteAccountModal) {
  const client = useStyroClient(true)
  const queryClient = useQueryClient()
  const loader = useTopLoader()

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<DeleteAccountFormValues>({
    defaultValues: {
      confirm: false,
    },
    mode: 'all',
    resolver: zodResolver(deleteAccountFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-deleteUsersMe'],
    mutationFn: async () => {
      const _response = await client.deleteUsersMe()
    },
    onSuccess: () => {
      loader.start()
      queryClient.clear()
      logoutAction()
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(async () => {
    await mutateAsync()
  }, [mutateAsync])

  const isDisabled = form.formState.isSubmitting || !form.formState.isValid

  return (
    <Dialog onOpenChange={() => setMessage(null)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Deleting your account is permanent. All your data will be lost and
            cannot be recovered.
          </DialogDescription>
        </DialogHeader>
        <PortalForm form={form} onValid={onSubmit}>
          <FormField
            name="confirm"
            control={form.control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl>
                <FormItem>
                  <div className="items-center flex justify-between">
                    <label htmlFor="confirm">
                      I understand that this action is irreversible.
                    </label>
                    <Checkbox
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <div>
            <Button
              type="submit"
              variant="destructive"
              fullWidth
              disabled={isDisabled}
            >
              Delete Account
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
