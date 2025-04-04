'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError, StyroResults } from '@sushiswap/styro-client'
import {
  Button,
  Collapsible,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import { CopyButton } from 'src/app/portal/_common/ui/copy-button'
import { z } from 'zod'

interface ApiKeyKeyForm {
  teamId: string
  apiKey: Pick<
    StyroResults['getTeamsTeamIdApiKeysApiKeyId']['data']['team']['apiKey'],
    'id' | 'key'
  >
}

const apiKeyKeySchema = z.object({
  key: z.string(),
})

type ApiKeyKeyFormValues = z.infer<typeof apiKeyKeySchema>

export function ApiKeyKeyForm({ teamId, apiKey }: ApiKeyKeyForm) {
  const client = useStyroClient(true)

  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const form = useForm<ApiKeyKeyFormValues>({
    defaultValues: {
      ...apiKey,
    },
    resolver: zodResolver(apiKeyKeySchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: [
      'portal-postTeamsTeamIdApiKeysApiKeyIdReset',
      teamId,
      apiKey.id,
    ],
    mutationFn: async (_values: ApiKeyKeyFormValues) => {
      const response = await client.postTeamsTeamIdApiKeysApiKeyIdReset({
        teamId,
        apiKeyId: apiKey.id,
      })

      return response.data
    },
    onSuccess: (data) => {
      form.reset({ key: data.newApiKey })
    },
    onError: async (e: ResponseError) => {
      setGlobalMsg({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: ApiKeyKeyFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isValid = form.formState.isValid
  const isPending = form.formState.isSubmitting

  const canSubmit = isValid && !isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="key"
              control={form.control}
              render={({ field: { value } }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Key</FormLabel>
                      <div className="space-x-2 flex items-center">
                        <TextField type="text" value={value} disabled={true} />
                        <CopyButton value={value} />
                      </div>
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <CheckerRoleClient
              message="You must be the owner or admin of the team to reset api keys"
              requiredRole="admin"
              teamId={teamId}
            >
              {(disabled) => (
                <Button
                  type="submit"
                  variant="destructive"
                  fullWidth
                  disabled={disabled || !canSubmit}
                >
                  Reset
                </Button>
              )}
            </CheckerRoleClient>
            <Collapsible open={!!globalMsg}>
              <div
                className={classNames(
                  globalMsg?.type === 'success' && 'text-green-500',
                  globalMsg?.type === 'error' && 'text-red-500',
                  'w-full text-center font-medium pt-4',
                )}
              >
                {globalMsg?.message || ''}
              </div>
            </Collapsible>
          </div>
        </div>
      </FormProvider>
    </form>
  )
}
