'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Checkbox,
  Collapsible,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { type ReactNode, useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import { z } from 'zod'

interface ApiKeyDeleteDialog {
  children: ReactNode
  teamId: string
  apiKeyId: string
}

const apiKeyDeleteFormSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {}),
})

type ApiKeyDeleteFormValues = z.infer<typeof apiKeyDeleteFormSchema>

export function ApiKeyDeleteDialog({
  children,
  teamId,
  apiKeyId,
}: ApiKeyDeleteDialog) {
  const router = useRouter()
  const client = useStyroClient(true)

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<ApiKeyDeleteFormValues>({
    defaultValues: {
      confirm: false,
    },
    mode: 'all',
    resolver: zodResolver(apiKeyDeleteFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-deleteTeamsTeamIdApiKeysApiKeyId', teamId, apiKeyId],
    mutationFn: async () => {
      await client.deleteTeamsTeamIdApiKeysApiKeyId({
        teamId,
        apiKeyId,
      })
    },
    onSuccess: () => {
      router.push(`/portal/dashboard/${teamId}/api-keys`)
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (_values: ApiKeyDeleteFormValues) => {
      await mutateAsync()
    },
    [mutateAsync],
  )

  const isDirty = form.formState.isDirty
  const isPending = form.formState.isSubmitting

  const canSubmit = isDirty && !isPending

  return (
    <Dialog
      onOpenChange={() => {
        form.reset()
        setMessage(null)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <PortalForm form={form} onValid={onSubmit}>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Deleting the key is permanent. Services using it will stop working
              and all settings will be lost.
            </DialogDescription>
          </DialogHeader>
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
              disabled={!canSubmit}
            >
              Delete
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
