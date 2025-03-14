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
  Explainer,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Slider,
  classNames,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import { z } from 'zod'

interface ApiKeyRateLimitForm {
  teamId: string
  apiKey: Pick<
    StyroResults['getTeamsTeamIdApiKeysApiKeyId']['data']['team']['apiKey'],
    'id' | 'rateLimit'
  >
  plan: StyroResults['getTeamsTeamIdPlan']['data']['team']['plan']
}

const apiKeyRateLimitSchema = (max: number) =>
  z.object({
    perSecond: z.number().int().min(0).max(max).nullable().optional(),
    perIpPerSecond: z.number().int().min(0).max(max).nullable().optional(),
  }) satisfies z.ZodType<
    Parameters<
      StyroClient['patchTeamsTeamIdApiKeysApiKeyId']
    >[0]['patchTeamsTeamIdApiKeysApiKeyIdRequest']['apiKey']['rateLimit']
  >

type ApiKeyRateLimitFormValues = z.infer<
  ReturnType<typeof apiKeyRateLimitSchema>
>

export function ApiKeyRateLimitForm({
  teamId,
  apiKey,
  plan,
}: ApiKeyRateLimitForm) {
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

  const form = useForm<ApiKeyRateLimitFormValues>({
    defaultValues: {
      ...apiKey.rateLimit,
    },
    resolver: zodResolver(apiKeyRateLimitSchema(plan.swapRateLimit.perSecond)),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-patchTeamsTeamIdApiKeysApiKeyId', teamId, apiKey.id],
    mutationFn: async (values: ApiKeyRateLimitFormValues) => {
      const response = await client.patchTeamsTeamIdApiKeysApiKeyId({
        teamId,
        apiKeyId: apiKey.id,
        patchTeamsTeamIdApiKeysApiKeyIdRequest: {
          apiKey: {
            rateLimit: {
              // 0 -> null === unset === infinite
              perSecond: values.perSecond || null,
              perIpPerSecond: values.perIpPerSecond || null,
            },
          },
        },
      })

      return response.data
    },
    onSuccess: (data) => {
      form.reset(data.team.apiKey.rateLimit)
      setGlobalMsg({ type: 'success', message: 'Rate limit updated' })
    },
    onError: async (e: ResponseError) => {
      setGlobalMsg({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: ApiKeyRateLimitFormValues) => {
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
              name="perSecond"
              control={form.control}
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel className="space-x-1 flex flex-row items-center">
                        <span>Requests per second</span>
                        <Explainer>
                          The global rate limit for the key.
                        </Explainer>
                      </FormLabel>
                      <div className="flex flex-row items-center space-x-4 justify-between w-full py-2">
                        <div className="flex flex-col w-full space-y-2">
                          <Slider
                            value={value ? [value] : [0]}
                            min={0}
                            max={plan.swapRateLimit.perSecond}
                            step={1}
                            onValueChange={([value]) => onChange(value || null)}
                            onBlur={onBlur}
                            disabled={isPending}
                          />
                          <div className="flex flex-row justify-between items-center text-xs text-gray-500">
                            <span className="space-x-1 flex flex-row items-center">
                              <span>Unset</span>
                              <Explainer>
                                Defaults to the your plan's maximum rate.
                              </Explainer>
                            </span>
                            <span>{plan.swapRateLimit.perSecond}</span>
                          </div>
                        </div>
                        <span className="whitespace-nowrap min-w-[60px] text-end">
                          {value || '-'} RPS
                        </span>
                      </div>
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
            <FormField
              name="perIpPerSecond"
              control={form.control}
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel className="space-x-1 flex flex-row items-center">
                        <span>Requests per IP per second</span>
                        <Explainer>
                          This rate limit will be applied separately for each
                          unique IP address. Useful for situations where the key
                          might be publicly exposed.
                        </Explainer>
                      </FormLabel>
                      <div className="flex flex-row items-center space-x-4 justify-between w-full py-2">
                        <div className="flex flex-col w-full space-y-2">
                          <Slider
                            value={value ? [value] : [0]}
                            min={0}
                            max={plan.swapRateLimit.perSecond}
                            step={1}
                            onValueChange={([value]) => onChange(value || null)}
                            onBlur={onBlur}
                            disabled={isPending}
                          />
                          <div className="flex flex-row justify-between items-center text-xs text-gray-500">
                            <span className="space-x-1 flex flex-row items-center">
                              <span>Unset</span>
                              <Explainer>
                                Defaults to the your plan's maximum rate.
                              </Explainer>
                            </span>
                            <span>{plan.swapRateLimit.perSecond}</span>
                          </div>
                        </div>
                        <span className="whitespace-nowrap min-w-[60px] text-end">
                          {value || '-'} RPS
                        </span>
                      </div>
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <CheckerRoleClient
              message="You must be the owner or admin of the team to update rate limits"
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
