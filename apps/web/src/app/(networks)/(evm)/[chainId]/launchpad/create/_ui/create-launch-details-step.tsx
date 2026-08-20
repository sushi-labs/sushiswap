import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSection,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextField,
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
import type { CreateLaunchForm } from './create-launch-types'

export function CreateLaunchDetailsStep({
  methods,
  logo,
  onLogoChange,
  onLogoProcessingChange,
  onContinue,
}: {
  methods: UseFormReturn<CreateLaunchForm>
  logo: PreparedLaunchpadLogoFile | null
  onLogoChange: (logo: PreparedLaunchpadLogoFile | null) => void
  onLogoProcessingChange: (isProcessing: boolean) => void
  onContinue: () => void
}) {
  return (
    <PerpsCard className="p-5 sm:p-7" fullWidth>
      <FormSection
        title="Onchain identity"
        description="Name and symbol are permanent after launch."
      >
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
            <div className="text-xs text-perps-muted-50">Total supply</div>
            <div className="mt-1 font-semibold">1B</div>
          </div>
          <div>
            <div className="text-xs text-perps-muted-50">Decimals</div>
            <div className="mt-1 font-semibold">18</div>
          </div>
        </div>
      </FormSection>

      <div className="my-3 border-t border-white/[0.06]" />

      <FormSection
        title="Launch configuration"
        description="Choose the initial liquidity curve and how non-protocol trading fees are handled."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={methods.control}
            name="liquidityMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liquidity mode</FormLabel>
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
                  <SelectContent className="!bg-black/10 backdrop-blur-2xl">
                    <SelectItem value="MOON">Moon</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="feeDisposition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <span>Creator fee mode</span>
                  <HoverCard openDelay={0} closeDelay={0}>
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
                          {SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS[disposition]}
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
                  <SelectContent className="!bg-black/10 backdrop-blur-2xl">
                    <SelectItem value="BUYBACK_AND_BURN">
                      Buyback &amp; burn
                    </SelectItem>
                    <SelectItem value="BURN_LAUNCH_TOKEN_FEES">
                      Burn token fees
                    </SelectItem>
                    <SelectItem value="DIRECT_PAYOUT">Direct payout</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <div className="my-3 border-t border-white/[0.06]" />

      <FormSection
        title="Project details"
        description="This metadata can be edited later by the current creator wallet."
      >
        <LaunchpadLogoInput
          id="launch-logo"
          prompt="Choose a token logo"
          value={logo}
          onChange={onLogoChange}
          onProcessingChange={onLogoProcessingChange}
        />
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
        <div className="grid gap-5 sm:grid-cols-2">
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
      </FormSection>

      <div className="mt-7 flex justify-end">
        <Button
          type="button"
          size="lg"
          variant="perps-default"
          icon={ArrowRightIcon}
          iconPosition="end"
          onClick={onContinue}
        >
          Choose initial buy
        </Button>
      </div>
    </PerpsCard>
  )
}
