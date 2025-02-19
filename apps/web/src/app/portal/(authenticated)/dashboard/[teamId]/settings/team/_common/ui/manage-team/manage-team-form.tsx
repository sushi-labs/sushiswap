'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Collapsible,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextField,
  classNames,
  formClassnames,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { revalidateTag } from 'next/cache'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface ManageTeamForm {
  team: {
    id: string
    name: string
    memberPermissions: z.infer<typeof zMemberPermission>
  }
}

const zMemberPermission = z.enum(['none', 'add-remove'])

const manageTeamFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(4, { message: 'Minimum length is 4 characters' })
    .max(16, { message: 'Maximum length is 16 characters' }),
  memberPermissions: zMemberPermission,
})

type ManageTeamFormValues = z.infer<typeof manageTeamFormSchema>

export function ManageTeamForm({ team: initialTeam }: ManageTeamForm) {
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

  const form = useForm<ManageTeamFormValues>({
    defaultValues: initialTeam,
    mode: 'all',
    resolver: zodResolver(manageTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['manage-team'],
    onMutate: async (_values: ManageTeamFormValues) => {},
    onSuccess: () => {
      revalidateTag(`portal-team-${initialTeam.id}`)
    },
  })

  const onSubmit = useCallback(
    async (values: ManageTeamFormValues) => {
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
                      <FormLabel>Team Name</FormLabel>
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
              control={form.control}
              name="memberPermissions"
              render={({
                field: { value, onChange },
                fieldState: { isDirty },
                formState: { disabled },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <FormLabel>Member Permissions</FormLabel>
                    <Select
                      value={value}
                      onValueChange={onChange}
                      disabled={disabled}
                    >
                      <SelectTrigger className={formClassnames({ isDirty })}>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value={zMemberPermission.Enum['none']}>
                          None
                        </SelectItem>
                        <SelectItem
                          value={zMemberPermission.Enum['add-remove']}
                        >
                          Add or Remove Members
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <Button type="submit" fullWidth disabled={!canSubmit}>
              Change
            </Button>
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
