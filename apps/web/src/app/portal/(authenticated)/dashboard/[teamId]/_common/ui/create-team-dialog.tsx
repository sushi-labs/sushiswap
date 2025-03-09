'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Collapsible,
  Dialog,
  DialogContent,
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
  useForm,
} from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { z } from 'zod'

const createTeamFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum length is 4 characters' })
    .max(14, { message: 'Maximum length is 14 characters' }),
})

type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>

export function CreateTeamDialog({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const client = useStyroClient(true)
  const router = useRouter()

  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

  const form = useForm<CreateTeamFormValues>({
    defaultValues: {
      name: '',
    },
    mode: 'all',
    resolver: zodResolver(createTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['manage-team'],
    mutationFn: async (_values: CreateTeamFormValues) => {
      const response = await client.postTeams({
        patchTeamsTeamIdRequest: {
          name: form.getValues('name'),
        },
      })

      return response.data.team
    },
    onSuccess: (team) => {
      queryClient.refetchQueries({ queryKey: ['portal-getUsersMe'] })
      router.push(`/portal/dashboard/${team.id}`)
    },
    onError: async (e: ResponseError) => {
      setGlobalErrorMsg(await parseStyroError(e))
    },
  })

  const onSubmit = useCallback(
    async (values: CreateTeamFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isValid = form.formState.isValid
  const isPending = form.formState.isSubmitting

  const canSubmit = isValid && !isPending

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
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
                    <FormLabel>Team Name</FormLabel>
                    <TextField
                      type="text"
                      placeholder="The Best Team"
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
    </Dialog>
  )
}
