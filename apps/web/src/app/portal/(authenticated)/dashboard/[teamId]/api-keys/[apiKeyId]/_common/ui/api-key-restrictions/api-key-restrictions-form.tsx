'use client'

import { PlusIcon, XIcon } from '@heroicons/react-v1/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError, StyroResults } from '@sushiswap/styro-client'
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSection,
  Separator,
  Switch,
  TextField,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  FormProvider,
  type UseFieldArrayProps,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import { z } from 'zod'

function List({
  name,
}: { name: UseFieldArrayProps<ApiKeyRestrictionsFormValues>['name'] }) {
  const { control } = useFormContext<ApiKeyRestrictionsFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <FormLabel>List</FormLabel>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => {
          return (
            <FormField
              name={`${name}[${index}].value` as any}
              control={control}
              key={field.id}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError, isDirty },
              }) => (
                <FormControl key={index}>
                  <FormItem>
                    <div className="flex flex-row space-x-4 items-center">
                      <TextField
                        type="text"
                        value={value}
                        onValueChange={onChange}
                        onBlur={onBlur}
                        placeholder={
                          name.includes('ips')
                            ? '8.8.8.8/24'
                            : 'https://sushi.com'
                        }
                        className={formClassnames({ isDirty, isError })}
                      />
                      <div className="p-1 rounded-lg bg-secondary w-min h-min cursor-pointer">
                        <XIcon
                          width={16}
                          height={16}
                          className="text-red-500"
                          onClick={() => remove(index)}
                        />
                      </div>
                    </div>
                  </FormItem>
                </FormControl>
              )}
            />
          )
        })}
        <div
          className="p-1 rounded-lg bg-secondary w-min cursor-pointer"
          onKeyUp={() => append({ value: '' })}
          onClick={() => append({ value: '' })}
        >
          <PlusIcon width={16} height={16} className="text-green-500" />
        </div>
      </div>
    </div>
  )
}

function transformToFormValues(
  apiKey: Pick<
    StyroResults['getTeamsTeamIdApiKeysApiKeyId']['data']['team']['apiKey'],
    'id' | 'ipConfig' | 'originConfig'
  >,
): ApiKeyRestrictionsFormValues {
  return {
    ipConfig: {
      whitelist: {
        enabled: apiKey.ipConfig.whitelist.enabled,
        ips: apiKey.ipConfig.whitelist.ips.map((ip) => ({ value: ip })),
      },
      blacklist: {
        enabled: apiKey.ipConfig.blacklist.enabled,
        ips: apiKey.ipConfig.blacklist.ips.map((ip) => ({ value: ip })),
      },
    },
    originConfig: {
      whitelist: {
        enabled: apiKey.originConfig.whitelist.enabled,
        origins: apiKey.originConfig.whitelist.origins.map((origin) => ({
          value: origin,
        })),
      },
      blacklist: {
        enabled: apiKey.originConfig.blacklist.enabled,
        origins: apiKey.originConfig.blacklist.origins.map((origin) => ({
          value: origin,
        })),
      },
    },
  }
}

interface ApiKeyRestrictionsForm {
  teamId: string
  apiKey: Pick<
    StyroResults['getTeamsTeamIdApiKeysApiKeyId']['data']['team']['apiKey'],
    'id' | 'ipConfig' | 'originConfig'
  >
}

// TODO: Use zod's built-in IP validation after updating to v4
const ipSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)(?:\/(?:[0-9]|[12]\d|3[0-2]))?$/,
    { message: 'Invalid IP address' },
  )

const originSchema = z.string().url({ message: 'Invalid origin URL' })

const apiKeyBasicSettingsSchema = z.object({
  ipConfig: z.object({
    whitelist: z.object({
      enabled: z.boolean(),
      ips: z.array(z.object({ value: ipSchema })),
    }),
    blacklist: z.object({
      enabled: z.boolean(),
      ips: z.array(z.object({ value: ipSchema })),
    }),
  }),
  originConfig: z.object({
    whitelist: z.object({
      enabled: z.boolean(),
      origins: z.array(z.object({ value: originSchema })),
    }),
    blacklist: z.object({
      enabled: z.boolean(),
      origins: z.array(z.object({ value: originSchema })),
    }),
  }),
})

type ApiKeyRestrictionsFormValues = z.infer<typeof apiKeyBasicSettingsSchema>

export function ApiKeyRestrictionsForm({
  teamId,
  apiKey,
}: ApiKeyRestrictionsForm) {
  const client = useStyroClient(true)

  const { message, setMessage } = useCollapsibleMessage({
    successTimeout: 2000,
  })

  const form = useForm<ApiKeyRestrictionsFormValues>({
    defaultValues: transformToFormValues(apiKey),
    mode: 'all',
    resolver: zodResolver(apiKeyBasicSettingsSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-patchTeamsTeamIdApiKeysApiKeyId', teamId, apiKey.id],
    mutationFn: async (values: ApiKeyRestrictionsFormValues) => {
      const response = await client.patchTeamsTeamIdApiKeysApiKeyId({
        teamId,
        apiKeyId: apiKey.id,
        patchTeamsTeamIdApiKeysApiKeyIdRequest: {
          apiKey: {
            ipConfig: {
              whitelist: {
                enabled: values.ipConfig.whitelist.enabled,
                ips: values.ipConfig.whitelist.ips.map((ip) => ip.value),
              },
              blacklist: {
                enabled: values.ipConfig.blacklist.enabled,
                ips: values.ipConfig.blacklist.ips.map((ip) => ip.value),
              },
            },
            originConfig: {
              whitelist: {
                enabled: values.originConfig.whitelist.enabled,
                origins: values.originConfig.whitelist.origins.map(
                  (origin) => origin.value,
                ),
              },
              blacklist: {
                enabled: values.originConfig.blacklist.enabled,
                origins: values.originConfig.blacklist.origins.map(
                  (origin) => origin.value,
                ),
              },
            },
          },
        },
      })

      return response.data
    },
    onSuccess: (data) => {
      form.reset(transformToFormValues(data.team.apiKey))
      setMessage({ type: 'success', message: 'Restrictions updated' })
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: ApiKeyRestrictionsFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isDirty = form.formState.isDirty
  const isValid = form.formState.isValid
  const isPending = form.formState.isSubmitting

  const canSubmit = isDirty && isValid && !isPending

  return (
    <PortalForm form={form} onValid={onSubmit}>
      <FormSection
        title="IP Restrictions"
        description="Control access to your API key based on an IP address-based whitelist and blacklist."
      >
        <div className="uppercase text-xs">Whitelist</div>
        <div className="flex flex-col w-full space-y-4">
          <FormField
            name="ipConfig.whitelist.enabled"
            control={form.control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl>
                <FormItem className="w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enabled</FormLabel>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="ipConfig.whitelist.ips"
            control={form.control}
            render={() => (
              <FormControl>
                <FormItem className="w-full">
                  <List name="ipConfig.whitelist.ips" />
                </FormItem>
              </FormControl>
            )}
          />
        </div>
        <Separator />
        <div className="uppercase text-xs">Blacklist</div>
        <div className="flex flex-col w-full space-y-4">
          <FormField
            name="ipConfig.blacklist.enabled"
            control={form.control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl>
                <FormItem className="w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enabled</FormLabel>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <FormItem className="w-full">
            <List name="ipConfig.blacklist.ips" />
          </FormItem>
        </div>
      </FormSection>

      <Separator />

      <FormSection
        title="Origin Restrictions"
        description="Control access to your API key based on the origin of incoming requests."
      >
        <div className="uppercase text-xs">Whitelist</div>
        <div className="flex flex-col w-full space-y-4">
          <FormField
            name="originConfig.whitelist.enabled"
            control={form.control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl>
                <FormItem className="w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enabled</FormLabel>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <FormField
            name="originConfig.whitelist.origins"
            control={form.control}
            render={() => (
              <FormControl>
                <FormItem className="w-full">
                  <List name="originConfig.whitelist.origins" />
                </FormItem>
              </FormControl>
            )}
          />
        </div>
        <Separator />
        <div className="uppercase text-xs">Blacklist</div>
        <div className="flex flex-col w-full space-y-4">
          <FormField
            name="originConfig.blacklist.enabled"
            control={form.control}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { isDirty },
            }) => (
              <FormControl>
                <FormItem className="w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enabled</FormLabel>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                      className={formClassnames({ isDirty })}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <FormItem className="w-full">
            <List name="originConfig.blacklist.origins" />
          </FormItem>
        </div>
        <div>
          <CheckerRoleClient
            message="You must be the owner or admin of the team to change api key restrictions"
            requiredRole="admin"
            teamId={teamId}
          >
            {(disabled) => (
              <Button type="submit" fullWidth disabled={disabled || !canSubmit}>
                Save
              </Button>
            )}
          </CheckerRoleClient>
          <CollapsibleMessage message={message} />
        </div>
      </FormSection>
    </PortalForm>
  )
}
