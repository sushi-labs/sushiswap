'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
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
  FormLabel,
  TextField,
  classNames,
  formClassnames,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import type React from 'react'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { z } from 'zod'

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
  const client = useStyroClient(true)
  const router = useRouter()

  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

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
      router.push(
        `/portal/dashboard/${data.team.id}/api-keys/${data.team.apiKey.id}`,
      )
    },
    onError: async (e: ResponseError) => {
      setGlobalErrorMsg(await parseStyroError(e))
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
      <DialogContent>
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>Create a new API key</DialogTitle>
            <DialogDescription>
              Name your API key to get started. After that, you’ll be taken to a
              page for advanced configuration options
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                Create
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
            </form>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
      <DialogTrigger asChild>{children}</DialogTrigger>
    </Dialog>
  )
}
