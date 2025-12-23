'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  classNames,
  formClassnames,
} from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import type React from 'react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

const createApiKeyFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum length is 4 characters' })
    .max(20, { message: 'Maximum length is 20 characters' }),
})

type CreateApiKeyFormValues = z.infer<typeof createApiKeyFormSchema>

export function CreateApiKeyDialog({
  teamId,
  children,
}: { teamId: string; children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const client = useStyroClient(true)
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<CreateApiKeyFormValues>({
    defaultValues: {
      name: '',
    },
    mode: 'all',
    resolver: zodResolver(createApiKeyFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-postTeamsTeamIdApiKeys', teamId],
    mutationFn: async (values: CreateApiKeyFormValues) => {
      const response = await client.postTeamsTeamIdApiKeys({
        teamId,
        postTeamsTeamIdApiKeysRequest: {
          name: values.name,
        },
      })

      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['portal-getTeamsTeamIdApiKeys', teamId],
      })
      router.push(
        `/portal/dashboard/${data.team.id}/api-keys/${data.team.apiKey.id}`,
      )
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: CreateApiKeyFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isValid = form.formState.isValid
  const isPending = form.formState.isSubmitting

  const canSubmit = isValid && !isPending

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new API key</DialogTitle>
          <DialogDescription>
            Name your API key to get started. After that, you’ll be taken to a
            page for advanced configuration options
          </DialogDescription>
        </DialogHeader>
        <PortalForm form={form} onValid={onSubmit}>
          <FormField
            name="name"
            control={form.control}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { invalid: isError },
            }) => (
              <FormControl>
                <FormItem className="w-full">
                  <>
                    <FormLabel>Key Name</FormLabel>
                    <TextField
                      type="text"
                      placeholder="Backend"
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
              Create
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
