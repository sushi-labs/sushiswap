'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Checkbox,
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { type ReactNode, useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

interface DeleteTeamDialog {
  children: ReactNode
  teamId: string
}

const deleteTeamFormSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {}),
})

type DeleteTeamFormValues = z.infer<typeof deleteTeamFormSchema>

export function DeleteTeamDialog({ children, teamId }: DeleteTeamDialog) {
  const router = useRouter()

  const queryClient = useQueryClient()
  const client = useStyroClient(true)

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<DeleteTeamFormValues>({
    defaultValues: {
      confirm: false,
    },
    mode: 'all',
    resolver: zodResolver(deleteTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-deleteTeamsTeamId', teamId],
    mutationFn: async () => {
      await client.deleteTeamsTeamId({
        teamId,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['portal-getUsersMe'] })
      router.push('/portal/dashboard')
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (_values: DeleteTeamFormValues) => {
      await mutateAsync()
    },
    [mutateAsync],
  )

  const isDisabled = form.formState.isSubmitting || !form.formState.isValid

  return (
    <Dialog onOpenChange={() => setMessage(null)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Deleting the team is permanent. All keys, members and billing
            information will be lost.
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
              Delete Team
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
