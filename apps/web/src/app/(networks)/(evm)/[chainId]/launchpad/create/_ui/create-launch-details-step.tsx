import { InformationCircleIcon, MoonIcon } from '@heroicons/react/24/outline'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TextField,
  classNames,
} from '@sushiswap/ui'
import type { UseFormReturn } from 'react-hook-form'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { PreparedLaunchpadLogoFile } from '../../_lib/launchpad-logo'
import {
  SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS,
  SUSHI_V2_FEE_DISPOSITION_LABELS,
  SUSHI_V2_FEE_DISPOSITION_ORDER,
} from '../../_providers/sushi-v2/contract'
import { LaunchpadLogoInput } from '../../_ui/launchpad-logo-input'
import { CreateLaunchPreview } from './create-launch-preview'
import type { CreateLaunchForm } from './create-launch-types'

export function CreateLaunchDetailsStep({
  methods,
  logo,
  onLogoChange,
  onLogoProcessingChange,
  previewImageUrl,
  values,
  onContinue,
}: {
  methods: UseFormReturn<CreateLaunchForm>
  logo: PreparedLaunchpadLogoFile | null
  onLogoChange: (logo: PreparedLaunchpadLogoFile | null) => void
  onLogoProcessingChange: (isProcessing: boolean) => void
  previewImageUrl?: string
  values: CreateLaunchForm
  onContinue: () => void
}) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-3">
        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <div>
            <h2 className="text-base font-semibold text-perps-muted">
              Token basics
            </h2>
            <div className="mt-5 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token name</FormLabel>
                      <FormControl>
                        <TextField
                          type="text"
                          placeholder="e.g. Nori Club"
                          className="!bg-white/[0.04] !text-perps-muted"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <TextField
                          type="text"
                          placeholder="e.g. NORI"
                          className="!bg-white/[0.04] !text-perps-muted"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
                <div>
                  <div className="text-xs text-perps-muted-50">
                    Total supply
                  </div>
                  <div className="mt-1 font-semibold">1B</div>
                </div>
                <div>
                  <div className="text-xs text-perps-muted-50">Decimals</div>
                  <div className="mt-1 font-semibold">18</div>
                </div>
              </div>
            </div>
          </div>
        </PerpsCard>

        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <div>
            <h2 className="text-base font-semibold text-perps-muted">
              Launch configuration
            </h2>
            <div className="mt-5 space-y-5">
              <FormField
                control={methods.control}
                name="feeDisposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <span>Creator fee mode</span>
                      <HoverCard openDelay={150} closeDelay={50}>
                        <HoverCardTrigger asChild>
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label="Explain creator fee modes"
                            className="inline-flex text-perps-muted-50 outline-none transition-colors hover:text-perps-muted focus-visible:text-perps-muted"
                          >
                            <InformationCircleIcon className="h-4 w-4" />
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          forceMount
                          side="top"
                          className="max-w-[320px] space-y-2 whitespace-normal !bg-black/10 !px-3 !py-2 text-left text-xs"
                        >
                          {SUSHI_V2_FEE_DISPOSITION_ORDER.map((disposition) => (
                            <p key={disposition}>
                              <span className="font-semibold">
                                {SUSHI_V2_FEE_DISPOSITION_LABELS[disposition]}:
                              </span>{' '}
                              {
                                SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS[
                                  disposition
                                ]
                              }
                            </p>
                          ))}
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          ref={field.ref}
                          onBlur={field.onBlur}
                          className="w-full !border !border-white/[0.06] !bg-white/[0.04] !text-perps-muted focus:!border-perps-blue"
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-black/30 backdrop-blur-2xl">
                        <SelectItem value="BUYBACK_AND_BURN">
                          Buyback &amp; burn
                        </SelectItem>
                        <SelectItem value="BURN_LAUNCH_TOKEN_FEES">
                          Burn token fees
                        </SelectItem>
                        <SelectItem value="DIRECT_PAYOUT">
                          Direct payout
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="liquidityMode"
                render={({ field }) => {
                  const isMoonMode = field.value === 'MOON'

                  return (
                    <div
                      className={classNames(
                        'rounded-xl border p-4 transition-colors',
                        isMoonMode
                          ? 'border-[#8b5cf6]/50 bg-[#7c3aed]/[0.07]'
                          : 'border-white/[0.08] bg-white/[0.03]',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={classNames(
                            'grid h-12 w-12 shrink-0 place-items-center rounded-full border border-dashed transition-colors',
                            isMoonMode
                              ? 'border-[#8b5cf6]/40 bg-[#7c3aed]/10 text-[#c4b5fd]'
                              : 'border-white/[0.12] bg-white/[0.03] text-perps-muted-50',
                          )}
                        >
                          <MoonIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-perps-muted">
                              Moon mode
                            </h3>
                            <span
                              className={classNames(
                                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                isMoonMode
                                  ? 'bg-[#7c3aed]/15 text-[#c4b5fd]'
                                  : 'bg-white/[0.06] text-perps-muted-50',
                              )}
                            >
                              {isMoonMode ? 'Active' : 'Standard mode'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-5 text-perps-muted-50">
                            Enhanced moon mechanics tek. Turn this off to use
                            Standard mode.
                          </p>
                        </div>
                        <Switch
                          ref={field.ref}
                          name={field.name}
                          checked={isMoonMode}
                          onBlur={field.onBlur}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'MOON' : 'STANDARD')
                          }
                          aria-label="Enable Moon mode"
                          className="mt-0.5 data-[state=checked]:!bg-[#7c3aed]"
                        />
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </PerpsCard>

        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <div>
            <div className="grid items-start gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-base font-semibold text-perps-muted">
                  Project details
                </h2>
                <p className="mt-1 text-sm leading-5 text-perps-muted-50">
                  This metadata can be edited later by the current creator
                  wallet.
                </p>
              </div>
              <LaunchpadLogoInput
                id="launch-logo"
                prompt="Choose a token logo"
                value={logo}
                onChange={onLogoChange}
                onProcessingChange={onLogoProcessingChange}
              />
            </div>
            <div className="mt-5">
              <FormField
                control={methods.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={4}
                        placeholder="Tell traders what your token is about…"
                        className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-perps-muted outline-none transition focus:border-perps-blue"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {(
                [
                  ['homepage', 'Website', 'https://example.com'],
                  ['x', 'X profile', 'https://x.com/project'],
                  ['telegram', 'Telegram', 'https://t.me/project'],
                ] as const
              ).map(([name, label, placeholder]) => (
                <FormField
                  key={name}
                  control={methods.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <TextField
                          type="text"
                          placeholder={placeholder}
                          className="!bg-white/[0.04] !text-perps-muted"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </PerpsCard>
      </div>

      <CreateLaunchPreview
        name={values.name}
        symbol={values.symbol}
        liquidityMode={values.liquidityMode}
        feeDisposition={values.feeDisposition}
        previewImageUrl={previewImageUrl}
        onContinue={onContinue}
      />
    </div>
  )
}
