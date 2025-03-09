'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Collapsible,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  classNames,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { z } from 'zod'
import { Crypto } from './crypto/crypto'

const voucherSchema = z.object({
  code: z.string().length(12).toUpperCase(),
})

type VoucherForm = z.infer<typeof voucherSchema>

function Voucher({ teamId }: { teamId: string }) {
  const client = useStyroClient(true)
  const router = useRouter()

  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)
  const [tab, setTab] = useState<'enter-code' | 'success'>('enter-code')

  const form = useForm<VoucherForm>({
    defaultValues: {
      code: '',
    },
    mode: 'all',
    resolver: zodResolver(voucherSchema),
  })

  const { data, mutateAsync, isPending } = useMutation({
    mutationKey: [],
    mutationFn: async ({ code }: VoucherForm) => {
      const response = await client.postTeamsTeamIdBillingVoucher({
        teamId,
        postTeamsTeamIdBillingVoucherRequest: {
          voucherCode: code,
        },
      })

      return response.data
    },
    onSuccess: () => {
      setTab('success')
      router.refresh()
    },
    onError: async (e: ResponseError) => {
      setGlobalErrorMsg(await parseStyroError(e))
    },
  })

  const onSubmit = useCallback(
    async (values: VoucherForm) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const canSubmit = !isPending && form.formState.isValid

  return (
    <Tabs value={tab}>
      <TabsContent value="enter-code">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormProvider {...form}>
            <FormField
              name="code"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Voucher Code</FormLabel>
                      <TextField
                        type="text"
                        placeholder="A6ESAES95TJ4"
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
                Submit
              </Button>
              <Collapsible open={!!globalErrorMsg}>
                <div
                  className={classNames(
                    globalErrorMsg && 'text-red-500',
                    'w-full text-center font-medium pt-6',
                  )}
                >
                  {globalErrorMsg || ''}
                </div>
              </Collapsible>
            </div>
          </FormProvider>
        </form>
      </TabsContent>
      <TabsContent
        value="success"
        className="flex-col flex space-y-4 items-center"
      >
        <span className="text-2xl font-medium">
          Successfuly redeemed{' '}
          {data?.amountUSD.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
          .
        </span>
        <CheckMarkIcon width={40} height={40} />
      </TabsContent>
    </Tabs>
  )
}

export function BalanceTopUpDialog({
  children,
  teamId,
}: { children: React.ReactNode; teamId: string }) {
  const [tab, setTab] = useState<'crypto' | 'voucher'>('crypto')

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up</DialogTitle>
          <DialogDescription>Top up your team's balance</DialogDescription>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as 'crypto' | 'voucher')}
          className="w-full space-y-4"
        >
          <TabsList className="!flex">
            <TabsTrigger value="crypto" className="flex flex-1">
              Crypto
            </TabsTrigger>
            <TabsTrigger value="voucher" className="flex flex-1">
              Voucher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto">
            <Crypto teamId={teamId} />
          </TabsContent>
          <TabsContent value="voucher">
            <Voucher teamId={teamId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
