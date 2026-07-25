'use client'

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Container,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Message,
  TextField,
} from '@sushiswap/ui'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import * as z from 'zod'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount, shortenAddress } from '../../../_ui/format'
import { StatusPill } from '../../../_ui/status-pill'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'
import { useLaunchpadToken } from '../../../hooks/use-launchpad-data'

const optionalHttpsUrl = z.union([
  z.literal(''),
  z.string().url().startsWith('https://'),
])

const metadataSchema = z.object({
  description: z.string().max(500),
  homepage: optionalHttpsUrl,
  x: z.union([z.literal(''), z.string().url().startsWith('https://x.com/')]),
})

type MetadataForm = z.infer<typeof metadataSchema>

export function ManageTokenPage({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const chainKey = getEvmChainById(chainId).key
  const {
    data: token,
    isError,
    isPending,
    refetch,
  } = useLaunchpadToken(chainId, address)
  const [saved, setSaved] = useState(false)
  const [distributed, setDistributed] = useState(false)
  const [logoName, setLogoName] = useState<string | null>(null)
  const metadataDefaults = useMemo<MetadataForm>(
    () => ({
      description: token?.metadata.description ?? '',
      homepage:
        token?.metadata.links.find((link) => link.kind === 'homepage')?.url ??
        '',
      x: token?.metadata.links.find((link) => link.kind === 'x')?.url ?? '',
    }),
    [token],
  )
  const methods = useForm<MetadataForm>({
    resolver: zodResolver(metadataSchema),
    mode: 'onChange',
    defaultValues: metadataDefaults,
  })

  useEffect(() => methods.reset(metadataDefaults), [metadataDefaults, methods])

  if (isPending) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-perps-muted-50" />
          <h1 className="mt-4 text-xl font-semibold">Loading launch</h1>
        </PerpsCard>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <h1 className="text-2xl font-semibold">Could not load launch</h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            The launchpad API did not return a usable response.
          </p>
          <Button
            variant="perps-secondary"
            className="mt-6"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  if (!token) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <h1 className="text-2xl font-semibold">Launch not found</h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            This token is not present in the launchpad catalog.
          </p>
          <Button
            asChild
            variant="perps-secondary"
            className="mt-6"
            icon={ArrowLeftIcon}
          >
            <Link href={`/${chainKey}/launchpad/manage`}>
              Back to dashboard
            </Link>
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  return (
    <Container maxWidth="6xl" className="w-full px-4 py-10 sm:py-14">
      <div className="flex items-center gap-2 text-sm text-perps-muted-50">
        <Link
          href={`/${chainKey}/launchpad/manage`}
          className="flex items-center gap-1.5 transition hover:text-perps-blue"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          My launches
        </Link>
        <span>/</span>
        <span>{token.symbol}</span>
      </div>

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <TokenAvatar symbol={token.symbol} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-semibold tracking-tight text-perps-muted">
                Manage {token.name}
              </h1>
              <StatusPill status={token.indexingStatus} />
            </div>
            <div className="mt-1.5 text-sm text-perps-muted-50">
              {shortenAddress(token.address, 7)} · metadata revision{' '}
              {token.metadata.revision}
            </div>
          </div>
        </div>
        <Button asChild variant="perps-secondary">
          <Link href={`/${chainKey}/launchpad/token/${token.address}`}>
            View token page
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(() => setSaved(true))}>
            <PerpsCard className="p-5 sm:p-7" fullWidth>
              <div>
                <h2 className="text-lg font-semibold text-perps-muted">
                  Public profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-perps-muted-50">
                  Metadata updates replace the complete editable document and
                  are signed against revision {token.metadata.revision}.
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="replacement-logo"
                  className="flex min-h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.03] p-5 text-center transition hover:border-perps-blue/40"
                >
                  <input
                    id="replacement-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) =>
                      setLogoName(event.target.files?.[0]?.name ?? null)
                    }
                  />
                  <span>
                    <CloudArrowUpIcon className="mx-auto h-6 w-6 text-perps-blue" />
                    <span className="mt-2 block text-sm font-medium">
                      {logoName ?? 'Replace token logo'}
                    </span>
                    <span className="mt-1 block text-xs text-perps-muted-50">
                      The signed upload and confirmation run after selection.
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-6 space-y-5">
                <FormField
                  control={methods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={5}
                          className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-perps-muted outline-none transition focus:border-perps-blue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={methods.control}
                    name="homepage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X profile</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {saved ? (
                <Message variant="success" className="mt-6">
                  Metadata mutation handoff is ready. Replace this preview state
                  with the signed updateMetadata mutation.
                </Message>
              ) : null}

              <div className="mt-7 flex justify-end">
                <Button type="submit" size="lg" variant="perps-default">
                  Sign &amp; save changes
                </Button>
              </div>
            </PerpsCard>
          </form>
        </Form>

        <div className="space-y-5">
          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center gap-2">
              <LockClosedIcon className="h-5 w-5 text-perps-blue" />
              <h2 className="font-semibold text-perps-muted">
                Immutable facts
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              {[
                ['Name', token.name],
                ['Symbol', token.symbol],
                [
                  'Supply',
                  formatRawAmount(token.initialSupply, token.decimals, 0),
                ],
                ['Decimals', `${token.decimals}`],
                ['Pool tier', `${token.pool.feeTier / 10_000}%`],
                ['Positions', `${token.positions.length}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-perps-muted-50">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-perps-blue" />
              <h2 className="font-semibold text-perps-muted">
                Creator authority
              </h2>
            </div>
            <p className="mt-3 break-all font-mono text-xs leading-5 text-perps-muted-50">
              {token.creator}
            </p>
            <p className="mt-3 text-xs leading-5 text-perps-muted-50">
              The backend verifies this immutable address independently for
              every metadata and logo signature.
            </p>
          </PerpsCard>
        </div>
      </div>

      <PerpsCard className="mt-5 overflow-hidden" fullWidth>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <BanknotesIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-perps-muted">
                  Distribute trading fees
                </h2>
                <p className="mt-0.5 text-xs text-perps-muted-50">
                  Collects every registered V3 position in one transaction
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/[0.04] p-4">
                <div className="text-xs text-perps-muted-50">Launch token</div>
                <div className="mt-1 font-semibold">Resolved on simulation</div>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-4">
                <div className="text-xs text-perps-muted-50">Quote fees</div>
                <div className="mt-1 font-semibold">Resolved on simulation</div>
              </div>
              <div className="col-span-2 rounded-xl bg-white/[0.04] p-4 sm:col-span-1">
                <div className="text-xs text-perps-muted-50">Recipients</div>
                <div className="mt-1 font-semibold">Sushi and the creator</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-perps-muted-50">
              Distribution is permissionless. Proceeds go to the immutable
              creator and Sushi recipients—not to the transaction caller.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-perps-muted-50">Sushi recipient</span>
              <span className="font-medium">70%</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-perps-muted-50">Creator recipient</span>
              <span className="font-medium">30%</span>
            </div>
            <Button
              fullWidth
              size="lg"
              variant="perps-default"
              className="mt-5"
              icon={distributed ? ArrowPathIcon : undefined}
              onClick={() => setDistributed(true)}
            >
              {distributed ? 'Simulation ready' : 'Distribute fees'}
            </Button>
          </div>
        </div>
      </PerpsCard>
    </Container>
  )
}
