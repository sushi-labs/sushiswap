'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type {
  ResponseError,
  StyroClient,
  StyroResults,
} from '@sushiswap/styro-client'
import {
  Button,
  Collapsible,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TextField,
  classNames,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import { z } from 'zod'

interface ApiKeyBasicSettingsForm {
  teamId: string
  apiKey: Pick<
    StyroResults['getTeamsTeamIdApiKeysApiKeyId']['data']['team']['apiKey'],
    'id' | 'name' | 'enabled'
  >
}

const apiKeyBasicSettingsSchema = z.object({
  name: z.string().min(4).max(20),
  enabled: z.boolean(),
}) satisfies z.ZodType<
  Pick<
    Parameters<
      StyroClient['patchTeamsTeamIdApiKeysApiKeyId']
    >[0]['patchTeamsTeamIdApiKeysApiKeyIdRequest']['apiKey'],
    'name' | 'enabled'
  >
>

type ApiKeyBasicSettingsFormValues = z.infer<typeof apiKeyBasicSettingsSchema>

export function ApiKeyBasicSettingsForm({
  teamId,
  apiKey,
}: ApiKeyBasicSettingsForm) {
  const client = useStyroClient(true)

  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (globalMsg?.type === 'success') {
      timeout = setTimeout(() => setGlobalMsg(null), 2000)
    }

    return () => clearTimeout(timeout)
  }, [globalMsg])

  const form = useForm<ApiKeyBasicSettingsFormValues>({
    defaultValues: {
      ...apiKey,
    },
    resolver: zodResolver(apiKeyBasicSettingsSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-patchTeamsTeamIdApiKeysApiKeyId', teamId, apiKey.id],
    mutationFn: async (values: ApiKeyBasicSettingsFormValues) => {
      const response = await client.patchTeamsTeamIdApiKeysApiKeyId({
        teamId,
        apiKeyId: apiKey.id,
        patchTeamsTeamIdApiKeysApiKeyIdRequest: {
          apiKey: {
            name: values.name,
            enabled: values.enabled,
          },
        },
      })

      return response.data
    },
    onSuccess: (data) => {
      form.reset(data.team.apiKey)
      setGlobalMsg({ type: 'success', message: 'API key settings updated' })
    },
    onError: async (e: ResponseError) => {
      setGlobalMsg({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: ApiKeyBasicSettingsFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isDirty = form.formState.isDirty
  const isPending = form.formState.isSubmitting

  const canSubmit = isDirty && !isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError, isDirty },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Name</FormLabel>
                      <TextField
                        type="text"
                        placeholder="The Best Team"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        className={formClassnames({ isError, isDirty })}
                        disabled={isPending}
                      />
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
            <FormField
              name="enabled"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { isDirty },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Status</FormLabel>
                      <Tabs
                        value={value ? 'true' : 'false'}
                        onValueChange={(value) => onChange(value === 'true')}
                        onBlur={onBlur}
                      >
                        <TabsList
                          className={formClassnames({ isDirty }, '!flex')}
                        >
                          <TabsTrigger
                            value="false"
                            className={classNames(
                              'flex flex-1',
                              !value && '!text-red-500',
                            )}
                          >
                            Disabled
                          </TabsTrigger>
                          <TabsTrigger
                            value="true"
                            className={classNames(
                              'flex flex-1',
                              value && '!text-green-500',
                            )}
                          >
                            Enabled
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <CheckerRoleClient
              message="You must be the owner or admin of the team to change key settings"
              requiredRole="admin"
              teamId={teamId}
            >
              {(disabled) => (
                <Button
                  type="submit"
                  fullWidth
                  disabled={disabled || !canSubmit}
                >
                  Save
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
