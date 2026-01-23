'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback } from 'react'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

const createTeamFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum length is 4 characters' })
    .max(16, { message: 'Maximum length is 16 characters' }),
})

type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>

export function CreateTeamDialog({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const client = useStyroClient(true)
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<CreateTeamFormValues>({
    defaultValues: {
      name: '',
    },
    mode: 'all',
    resolver: zodResolver(createTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-postTeams'],
    mutationFn: async (values: CreateTeamFormValues) => {
      const response = await client.postTeams({
        postTeamsRequest: {
          name: values.name,
        },
      })

      return response.data.team
    },
    onSuccess: (team) => {
      queryClient.refetchQueries({ queryKey: ['portal-getUsersMe'] })
      router.push(`/portal/dashboard/${team.id}`)
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
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
        <PortalForm form={form} onValid={onSubmit}>
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
          <div>
            <Button type="submit" fullWidth disabled={!canSubmit}>
              Create
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </DialogContent>
    </Dialog>
  )
}
