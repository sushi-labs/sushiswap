'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dots,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

interface NewInviteDialog {
  teamId: string
  children: React.ReactNode
}

const newInviteFormSchema = z.object({
  email: z.string().email(),
})

type NewInviteFormValues = z.infer<typeof newInviteFormSchema>

export function NewInviteDialog({ teamId, children }: NewInviteDialog) {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()
  const client = useStyroClient(true)

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<NewInviteFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'all',
    resolver: zodResolver(newInviteFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-postTeamsTeamIdInvites', teamId],
    mutationFn: async (values: NewInviteFormValues) => {
      const response = await client.postTeamsTeamIdInvites({
        teamId,
        postTeamsTeamIdInvitesRequest: {
          email: values.email,
          frontendUrl: window.location.origin,
        },
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['portal-getTeamsTeamIdInvites', teamId],
      })
      setOpen(false)
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: NewInviteFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isValid = form.formState.isValid
  const isPending = form.formState.isSubmitting

  const canSubmit = isValid && !isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Invite</DialogTitle>
          <DialogDescription>Invite a new user to your team</DialogDescription>
        </DialogHeader>
        <PortalForm form={form} onValid={onSubmit}>
          <FormField
            name="email"
            control={form.control}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { invalid: isError },
            }) => (
              <FormControl>
                <FormItem className="w-full">
                  <>
                    <FormLabel>E-mail</FormLabel>
                    <TextField
                      type="text"
                      placeholder="john@gmail.com"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={onBlur}
                      className={formClassnames({ isError })}
                      disabled={isPending}
                    />
                  </>
                </FormItem>
              </FormControl>
            )}
          />
          <div>
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {!isPending ? (
                'Create'
              ) : (
                <span>
                  Creating
                  <Dots />
                </span>
              )}
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
